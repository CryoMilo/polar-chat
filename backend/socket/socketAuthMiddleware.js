import User from "../models/User.js";
import jwt from "jsonwebtoken";
import cookie from "cookie";

export const socketAuthMiddleware = async (socket, next) => {
	try {
		const cookieHeader = socket.handshake.headers.cookie;

		if (!cookieHeader) return next(new Error("No Cookies Found!"));

		const parsedCookies = cookie.parse(cookieHeader);
		const token = parsedCookies.jwt;
		if (!token) return next(new Error(console.error("No Token Provided!")));

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findById(decoded.userId).select("-password");

		if (!user) return next(new Error(console.error("No User Found!")));

		socket.userId = user._id.toString();
		socket.user = user;

		next();
	} catch (error) {
		console.log(error);
		socket.emit("internal_error", { error: "Internal Server Error" });
	}
};
