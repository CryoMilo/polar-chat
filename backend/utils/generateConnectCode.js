import { customAlphabet } from "nanoid";
import User from "../models/User";

const generateCode = customAlphabet("0123456789", 6);

export async function generateConnectCode() {
	let code, userExists;

	do {
		code = generateCode();
		userExists = await User.exists({ connectCode: code });
	} while (userExists);

	return code;
}
