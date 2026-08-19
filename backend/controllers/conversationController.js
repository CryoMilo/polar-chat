import Conversation from "../models/Conversation.js";
import Friendship from "../models/Friendship.js";
import User from "../models/User.js";
import RedisService from "../services/RedisService.js";

export default class conversationController {
	static async checkConnectCode(req, res) {
		try {
			const userId = req.user._id;
			const { connectCode } = req.query;

			const friend = await User.findOne({ connectCode });

			if (!friend || friend._id.toString() === userId.toString()) {
				return res.status(400).json({ message: "Invalid connect ID" });
			}

			const existingFriendship = await Friendship.findOne({
				$or: [
					{ requester: userId, recipient: friend._id },
					{ requester: friend._id, recipient: userId },
				],
			});

			if (existingFriendship) {
				return res.status(400).json({ message: "Friendship already exists" });
			}

			res.json({
				success: true,
				message: "Connect ID is valid",
				data: {
					id: friend._id.toString(),
					username: friend.username,
					fullname: friend.fullname,
					avatar: friend.avatar || null,
				},
			});
		} catch (error) {
			console.log(error);
			res.status(500).json({ message: "Internal Server Error" });
		}
	}

	static async addConversation(req, res) {
		try {
			const userId = req.user._id;
			const { connectCode } = req.body;

			if (!connectCode) {
				return res.status(400).json({ message: "Connect code is required" });
			}

			const friend = await User.findOne({ connectCode });

			if (!friend) {
				return res.status(404).json({ message: "User not found with this connect code" });
			}

			if (friend._id.toString() === userId.toString()) {
				return res.status(400).json({ message: "You cannot add yourself" });
			}

			const existingFriendship = await Friendship.findOne({
				$or: [
					{ requester: userId, recipient: friend._id },
					{ requester: friend._id, recipient: userId },
				],
			});

			if (existingFriendship) {
				return res.status(400).json({ message: "Friendship already exists" });
			}

			// Create friendship
			const friendship = await Friendship.create({
				requester: userId,
				recipient: friend._id,
			});

			// Create conversation
			const conversation = await Conversation.create({
				participants: [userId, friend._id],
			});

			// Emit socket event to both requester and recipient rooms
			const io = req.app.get("io");
			if (io) {
				io.to(userId.toString()).emit("conversation:new", { conversationId: conversation._id });
				io.to(friend._id.toString()).emit("conversation:new", { conversationId: conversation._id });
			}

			res.json({
				success: true,
				message: "Conversation created successfully",
				data: {
					friendship,
					conversation,
				},
			});
		} catch (error) {
			console.error("Error adding conversation:", error);
			res.status(500).json({ message: "Internal Server Error" });
		}
	}

	static async markAsRead(req, res) {
		try {
			const userId = req.user._id;
			const { conversationId } = req.params;

			const conversation = await Conversation.findById(conversationId);
			if (!conversation) {
				return res.status(404).json({ message: "Conversation not found" });
			}

			if (!conversation.participants.includes(userId.toString())) {
				return res.status(403).json({ message: "Unauthorized" });
			}

			// Clear unread count for current user using mongoose map API
			conversation.unreadCounts.set(userId.toString(), 0);
			await conversation.save();

			res.json({ success: true, message: "Conversation marked as read" });
		} catch (error) {
			console.error("Error marking conversation as read:", error);
			res.status(500).json({ message: "Internal Server Error" });
		}
	}

	static async getConversations(req, res) {
		try {
			const userId = req.user._id;

			const friendships = await Friendship.find({
				$or: [{ requester: userId }, { recipient: userId }],
			})
				.populate([
					{ path: "requester", select: "id fullname username connectCode avatar" },
					{ path: "recipient", select: "id fullname username connectCode avatar" },
				])
				.lean();

			if (!friendships.length) {
				return res.json({ data: [] });
			}

			const friendIds = friendships.map((friend) =>
				friend.requester._id.toString() === userId.toString()
					? friend.recipient._id.toString()
					: friend.requester._id.toString()
			);

			const conversations = await Conversation.find({
				participants: {
					$all: [userId],
					$in: friendIds,
					$size: 2,
				},
			});

			const conversationMap = new Map();
			conversations.forEach((conversation) => {
				const friendId = conversation.participants.find(
					(p) => p.toString() !== userId.toString()
				);
				conversationMap.set(friendId.toString(), conversation);
			});

			const conversationData = await Promise.all([
				...friendships.map(async (friendship) => {
					const isRequester =
						friendship.requester._id.toString() === userId.toString();
					const friend = isRequester
						? friendship.recipient
						: friendship.requester;

					const conversation = conversationMap.get(friend._id.toString());

					return {
						conversationId: conversation ? conversation.id : null,
						lastMessage: conversation?.lastMessagePreview || null,
						unreadCounts: {
							[friendship.requester._id.toString()]:
								conversation?.unreadCounts instanceof Map
									? conversation.unreadCounts.get(
											friendship.requester._id.toString()
									  ) || 0
									: conversation?.unreadCounts?.[
											friendship.requester._id.toString()
									  ] || 0,
							[friendship.recipient._id.toString()]:
								conversation?.unreadCounts instanceof Map
									? conversation.unreadCounts.get(
											friendship.recipient._id.toString()
									  ) || 0
									: conversation?.unreadCounts?.[
											friendship.recipient._id.toString()
									  ] || 0,
						},
						friend: {
							id: friend._id.toString(),
							username: friend.username,
							fullname: friend.fullname,
							connectCode: friend.connectCode,
							avatar: friend.avatar || null,
							online: await RedisService.isUserOnline(friend._id.toString()),
						},
					};
				}),
			]);

			res.json({ data: conversationData });
		} catch (error) {
			console.error("Error fetching conversations", error);
			res.status(500).json({ message: "Internal Server Error" });
		}
	}
}
