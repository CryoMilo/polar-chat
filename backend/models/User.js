import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
	connectCode: {
		type: String,
		require: true,
		unique: true,
		index: true,
	},
	fullname: {
		type: String,
		trim: true,
		require: true,
	},
	username: {
		type: String,
		trim: true,
		require: true,
		unique: true,
		minLength: 6,
		maxLength: 20,
	},
	email: {
		type: String,
		trim: true,
		require: true,
		unique: true,
		lowercase: true,
	},
	password: {
		type: String,
		require: true,
		minLength: 6,
		maxLength: 20,
	},
});

export default mongoose.model("User", userSchema);
