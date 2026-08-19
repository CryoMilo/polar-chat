import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";

export default class messageController {
	static async sendMessage(req, res) {
		try {
			const senderId = req.user._id;
			const { conversationId, content } = req.body;

			if (!conversationId || !content) {
				return res.status(400).json({ message: "Conversation ID and content are required" });
			}

			const conversation = await Conversation.findById(conversationId);
			if (!conversation) {
				return res.status(404).json({ message: "Conversation not found" });
			}

			if (!conversation.participants.includes(senderId.toString())) {
				return res.status(403).json({ message: "You are not a participant of this conversation" });
			}

			const message = await Message.create({
				conversation: conversationId,
				sender: senderId,
				content,
			});

			const recipientId = conversation.participants.find(p => p.toString() !== senderId.toString());

			// Update unread count for recipient using mongoose map APIs
			const currentUnread = conversation.unreadCounts.get(recipientId.toString()) || 0;
			conversation.unreadCounts.set(recipientId.toString(), currentUnread + 1);
			await conversation.save();

			// Emit socket event to both sender and recipient rooms
			const io = req.app.get("io");
			if (io) {
				const socketMessage = {
					_id: message._id,
					conversation: message.conversation,
					sender: message.sender,
					content: message.content,
					read: message.read,
					createdAt: message.createdAt,
					updatedAt: message.updatedAt,
				};
				io.to(recipientId.toString()).emit("message:new", socketMessage);
				io.to(senderId.toString()).emit("message:new", socketMessage);
			}

			res.status(201).json({ success: true, data: message });
		} catch (error) {
			console.error("Error sending message:", error);
			res.status(500).json({ message: "Internal Server Error" });
		}
	}

	static async getMessages(req, res) {
		try {
			const userId = req.user._id;
			const { conversationId } = req.params;

			const conversation = await Conversation.findById(conversationId);
			if (!conversation) {
				return res.status(404).json({ message: "Conversation not found" });
			}

			if (!conversation.participants.includes(userId.toString())) {
				return res.status(403).json({ message: "You are not a participant of this conversation" });
			}

			const messages = await Message.find({ conversation: conversationId })
				.sort({ createdAt: 1 })
				.lean();

			res.json({ success: true, data: messages });
		} catch (error) {
			console.error("Error fetching messages:", error);
			res.status(500).json({ message: "Internal Server Error" });
		}
	}
}
