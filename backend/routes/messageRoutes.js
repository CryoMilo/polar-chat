import express from "express";
import MessageController from "../controllers/messageController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, MessageController.sendMessage);
router.get("/:conversationId", authMiddleware, MessageController.getMessages);

export default router;
