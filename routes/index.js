import { Router } from "express";
import companyRouter from "./companyRouter.js";
import authRouter from "./authRouter.js";

const router = Router();

router.get("/", async (req, res) => {
  return res.send("Index root");
});

router.use("/companies", companyRouter);
router.use("/auth", authRouter);

export default router;
