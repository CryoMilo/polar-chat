import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import User from "../models/User.js";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import Friendship from "../models/Friendship.js";
import { connectDB } from "./db.js";
import bcrypt from "bcryptjs";

async function resetDatabase() {
	try {
		await connectDB();
		await Message.deleteMany({});
		await Conversation.deleteMany({});
		await Friendship.deleteMany({});
		await User.deleteMany({});
		await mongoose.disconnect();
	} catch (error) {
		console.error("Error resetting the database", error);
		await mongoose.disconnect();
	}
}

async function seed() {
	try {
		// 1. Reset the database to ensure we start from a clean slate
		await resetDatabase();
		await connectDB();

		console.log("Database reset complete. Starting seeding...");

		// 2. Hash a standard test password to share across seeded users
		const salt = await bcrypt.genSalt(10);
		const passwordHash = await bcrypt.hash("password123", salt);

		// 3. Create dummy users with unique connect codes
		const users = await User.insertMany([
			{
				fullname: "Alice Johnson",
				username: "alicejohnson",
				email: "alice@polar.chat",
				password: passwordHash,
				connectCode: "111111",
			},
			{
				fullname: "Robert Smith",
				username: "robertsmith",
				email: "robert@polar.chat",
				password: passwordHash,
				connectCode: "222222",
			},
			{
				fullname: "Emily Davis",
				username: "emilydavis",
				email: "emily@polar.chat",
				password: passwordHash,
				connectCode: "333333",
			},
			{
				fullname: "Damian Aung",
				username: "damianaung",
				email: "damian@polar.chat",
				password: passwordHash,
				connectCode: "444444",
			},
		]);

		const [alice, robert, emily, damian] = users;
		console.log(`Seeded ${users.length} users successfully.`);

		// 4. Create friendships between seeded users
		await Friendship.insertMany([
			{ requester: damian._id, recipient: alice._id },
			{ requester: damian._id, recipient: robert._id },
			{ requester: damian._id, recipient: emily._id },
			{ requester: alice._id, recipient: robert._id },
		]);
		console.log("Seeded friendships successfully.");

		// 5. Establish initial conversation channels (participants must be sorted alphabetically by the post-save middleware)
		const conv1 = await Conversation.create({
			participants: [damian._id, alice._id],
		});
		const conv2 = await Conversation.create({
			participants: [damian._id, robert._id],
		});
		console.log("Seeded conversations successfully.");

		// 6. Create initial message items
		const messages = [
			{
				conversation: conv1._id,
				sender: alice._id,
				content: "Hey Damian! Did you see the new design layout?",
			},
			{
				conversation: conv1._id,
				sender: damian._id,
				content:
					"Yes, Alice! I just finished setting up the Tailwind templates.",
			},
			{
				conversation: conv2._id,
				sender: robert._id,
				content: "Did the backend seed script run correctly?",
			},
		];

		// We save individually so the messageSchema's post-save hook updates Conversation.lastMessage / lastMessagePreview automatically
		for (const msg of messages) {
			const newMessage = new Message(msg);
			await newMessage.save();
		}
		console.log("Seeded messages successfully.");

		console.log("Database seeded successfully!");
		await mongoose.disconnect();
	} catch (error) {
		console.error("Failed to seed data", error);
		await mongoose.disconnect();
	}
}

seed();
