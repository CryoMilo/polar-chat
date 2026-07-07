import User from "../models/User";
import bcrypt from "bcryptjs";

export class AuthController {
	static async register(req, res) {
		try {
			const { fullName, username, email, password } = req.body;

			if (!fullName || !username || !email || !password) {
				return res.status(400).json({ message: "All fields are required" });
			}

			if (password.length < 6) {
				return res.status(400).json({ message: "Password is too short" });
			}

			const existingUser = await User.findOne({
				$or: [{ username }, { email }],
			});

			if (existingUser) {
				return res.status(400).json({ message: "User already exists!" });
			}

			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hashSync(password, salt);

			const user = new User({
				fullname: fullName,
				username: username,
				email: email,
				password: hashedPassword,
				connectCode: "",
			});

			await user.save();

			res.status(201).json({ success: true, message: "User Created!" });
		} catch (error) {
			console.error("Server Error", error);
			process.exit(1);
		}
	}
}
