import mongoose from "mongoose";

export const connectDB = async () => {
	const uri = process.env.MONGO_URI;
	if (!uri) throw new Error("Mongo uri is not present");

	try {
		await mongoose.connect(uri, { dbName: "polar-chat" });
		console.log("MongoDB Connected!");
	} catch (error) {
		console.error("MongoDB Connection Failed", error);
		process.exit(1);
	}
};
