import { leaveAllRooms } from "./socket/helpers.js";
import { notifyConversationOnlineStatus } from "./socket/socketConversation.js";

export const initializeSocket = async (io) => {
	io.on("connection", async (socket) => {
		try {
			const user = socket.user;
			console.log("User connected", user.id);
			socket.join(user._id.toString());

			await notifyConversationOnlineStatus(io, socket, true);

			socket.on("disconnect", async () => {
				await notifyConversationOnlineStatus(io, socket, false);
				leaveAllRooms(socket);
			});
		} catch (error) {
			console.error("Socket Connection Error", error);
			socket.emit("internal_error", { error: "Internal Server Error" });
		}
	});
};
