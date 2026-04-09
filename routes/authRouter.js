import { Router } from "express";
import * as authController from "../controllers/authControllers.js";
import validateBody from "../middleware/validateBody.js";
import { loginBodySchema, registerBodySchema } from "../schemas/authSchemas.js";
import { authRateLimiter } from "../middleware/authRateLimit.js";

const router = Router();

router.use(authRateLimiter);

router.post(
  "/register",
  validateBody(registerBodySchema),
  authController.signUp,
);
router.post("/login", validateBody(loginBodySchema), authController.signIn);

export default router;
