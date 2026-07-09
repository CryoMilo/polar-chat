// FUNCTION authMiddleware(request, response, next_step):
//     TRY:
//         // 1. Check the ID badge
//         LOOK inside the request's cookie pile for a cookie named "jwt"

import User from "../models/User";

//         // 2. No badge? No entry.
//         IF there is no "jwt" cookie:
//             RETURN status 401 with message "Not authorized" (Stop right here!)

//         // 3. Verify the signature
//         DECODE the token using our backend's process.env.JWT_SECRET stamp

//         // 4. Fetch their profile from the warehouse (MongoDB)
//         FIND the user in the database using the ID we unpacked from the token
//         BUT hide their encrypted password string (.select("-password")) for safety

//         // 5. Attach the user identity to the current request object
//         ASSIGN this user data directly to request.user so the next functions can use it

//         // 6. Let them through the door!
//         TRIGGER next_step() (This tells Express to move to the final controller)

//     CATCH any tampering or expired token errors:
//         LOG the error
//         RETURN status 401 with message "Not authorized"

export const authMiddleware = async (req, res, next) => {
	try {
		const token = req.cookies.jwt;

		if (!token) {
			return res.status(401).json({ message: "Not Authorized!" });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = await User.findById(decoded.userId).select("-password");

		next();
	} catch (error) {
		console.log(error);
		res.status(401).json({ message: "Not Authorized!" });
	}
};
