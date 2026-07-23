import Conversation from "../models/Conversation.js";
import Friendship from "../models/Friendship.js";
import User from "../models/User.js";

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
			});
		} catch (error) {
			console.log(error);
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
					{ path: "requester", select: "id fullname username connectCode" },
					{ path: "recipient", select: "id fullname username connectCode" },
				])
				.lean();

			if (!friendships.length) {
				return res.json({ date: [] });
			}

			const friendIds = friendships.map((friend) =>
				friend.requester._id.toString() === userId._id.toString()
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
									? conversation.unreadCounts.get(friendship.requester._id.toString()) || 0
									: conversation?.unreadCounts?.[friendship.requester._id.toString()] || 0,
							[friendship.recipient._id.toString()]:
								conversation?.unreadCounts instanceof Map
									? conversation.unreadCounts.get(friendship.recipient._id.toString()) || 0
									: conversation?.unreadCounts?.[friendship.recipient._id.toString()] || 0,
						},
						friend: {
							id: friend._id.toString(),
							username: friend.username,
							fullname: friend.fullname,
							connectCode: friend.connectCode,
							online: false,
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
