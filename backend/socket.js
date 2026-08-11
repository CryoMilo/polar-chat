import { leaveAllRooms } from "./socket/helpers.js";
import { notifyConversationOnlineStatus } from "./socket/socketConversation.js";
import RedisService from "./services/RedisService.js";

export const initializeSocket = async (io) => {
	io.on("connection", async (socket) => {
		try {
			const user = socket.user;
			console.log("User connected", user.id);
			socket.join(user._id.toString());

			await RedisService.addUserSession(user.id, socket.id);
			await notifyConversationOnlineStatus(io, socket, true);

			socket.on("disconnect", async () => {
				await notifyConversationOnlineStatus(io, socket, false);

				await RedisService.removeUserSessions(user.id, socket.id);

				const isOnline = await RedisService.isUserOnline(user.id);

				if (!isOnline) {
					await notifyConversationOnlineStatus(io, socket, false);
					leaveAllRooms(socket);
				}

				leaveAllRooms(socket);
			});
		} catch (error) {
			console.error("Socket Connection Error", error);
			socket.emit("internal_error", { error: "Internal Server Error" });
		}
	});
};
