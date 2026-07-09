import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import AuthController from "../controllers/AuthController";

const router = express.Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/logout", authMiddleware, AuthController.logout);
router.get("/me", authMiddleware, AuthController.me);

export default router;
