import { Router } from "express";
import * as authController from "../controllers/authControllers.js";

const router = Router();

router.post("/register", authController.signUp);
router.post("/login", authController.signIn);

export default router;
