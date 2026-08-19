import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import AuthController from "../controllers/authController.js";

const router = express.Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/logout", authMiddleware, AuthController.logout);
router.get("/me", authMiddleware, AuthController.me);
router.put("/profile", authMiddleware, AuthController.updateProfile);

export default router;
