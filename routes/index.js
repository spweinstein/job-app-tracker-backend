import { Router } from "express";
import authRouter from "./authRouter.js";
import appRouter from "./applicationRouter.js";
import companyRouter from "./companyRouter.js";
import resumeRouter from "./resumeRouter.js";
import coverLetterRouter from "./coverLetterRouter.js";
import aiRouter from "./aiRouter.js";
import verifyToken from "../middleware/verifyToken.js";

const router = Router();

router.get("/", async (req, res) => {
  return res.send("Index root");
});

router.use("/auth", authRouter);
router.use("/ai", verifyToken, aiRouter);
router.use("/applications", verifyToken, appRouter);
router.use("/companies", verifyToken, companyRouter);
router.use("/resumes", verifyToken, resumeRouter);
router.use("/coverLetters", verifyToken, coverLetterRouter);

export default router;
