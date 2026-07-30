import Friendship from "./models/Friendship.js";

export const notifyConversationOnlineStatus = async (io, socket, online) => {
	try {
		const userId = socket.userId;
		const user = socket.user;

		const friendships = await Friendship.find({
			$or: [{ requester: userId }, { recipient: userId }],
		});
	} catch (error) {
		console.error("notifyConversationOnlineStatus", error);
	}
};
