import Friendship from "../models/Friendship.js";

export const notifyConversationOnlineStatus = async (io, socket, online) => {
	try {
		const userId = socket.userId;
		const user = socket.user;

		const friendships = await Friendship.find({
			$or: [{ requester: userId }, { recipient: userId }],
		});

		friendships.forEach((friendship) => {
			const isRequester =
				friendship.requester.toString() === userId.toString();
			const friendId = isRequester
				? friendship.recipient
				: friendship.requester;

			console.log("emit:conversation:online-status");
			io.to(friendId.toString()).emit("conversation:online-status", {
				friendId: userId,
				username: user.username,
				online,
			});
		});
	} catch (error) {
		console.error("notifyConversationOnlineStatus", error);
	}
};
