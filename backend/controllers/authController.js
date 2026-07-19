import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateConnectCode } from "../utils/generateConnectCode.js";
import jwt from "jsonwebtoken";

export default class AuthController {
	static async register(req, res) {
		try {
			const { fullname, username, email, password } = req.body;

			if (!fullname || !username || !email || !password) {
				return res.status(400).json({ message: "All fields are required" });
			}

			if (password.length < 6) {
				return res.status(400).json({ message: "Password is too short" });
			}

			const userExists = await User.exists({
				$or: [{ username }, { email }],
			});

			if (userExists) {
				return res.status(400).json({ message: "User already exists!" });
			}

			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hashSync(password, salt);

			const user = new User({
				fullname: fullname,
				username: username,
				email: email,
				password: hashedPassword,
				connectCode: await generateConnectCode(),
			});

			await user.save();

			res.status(201).json({ success: true, message: "User Created!" });
		} catch (error) {
			console.error("Server Error", error);
			process.exit(1);
		}
	}

	static async login(req, res) {
		try {
			const { email, password } = req.body;

			if (!email || !password) {
				return res.status(400).json({ message: "All fields are required" });
			}

			const user = await User.findOne({ email });

			if (!user) {
				return res.status(400).json({ message: "Invalid credentials!" });
			}

			const isValidPassword = await bcrypt.compare(password, user.password);
			if (!isValidPassword) {
				return res.status(400).json({ message: "Invalid credentials!" });
			}

			const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
				expiresIn: "7d",
			});

			res.cookie("jwt", token, {
				maxAge: 7 * 24 * 60 * 60 * 1000,
				httpOnly: true,
				sameSite: "strict",
				secure: process.env.NODE_ENV !== "development",
			});

			res.status(200).json({
				user: {
					id: user.id,
					fullname: user.fullname,
					username: user.username,
					email: user.email,
					connectCode: user.connectCode,
				},
			});
		} catch (error) {
			res.status(500).json({ message: `Internal server error ${error}` });
		}
	}

	static async logout(req, res) {
		try {
			res.clearCookie("jwt", {
				httpOnly: true,
				sameSite: "strict",
				secure: process.env.NODE_ENV !== "development",
			});

			res.status(204).json({ message: "Logout Successful" });
		} catch (error) {
			console.log(error);
			res.status(500).json({ message: "Internal server Error" });
		}
	}

	static async me(req, res) {
		try {
			const user = await User.findById(req.user.id).select("-password");

			if (!user) {
				return res.status(400).json({ message: "User not found!" });
			}

			res.status(200).json({
				user: {
					id: user.id,
					username: user.username,
					fullname: user.fullname,
					email: user.email,
					connectCode: user.connectCode,
				},
			});
		} catch (error) {
			console.log(error);
			res.status(500).json({ message: "Internal Server Error" });
		}
	}
}
