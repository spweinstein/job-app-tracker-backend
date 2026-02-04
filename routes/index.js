import { Router } from "express";
import companyRouter from "./companyRouter.js";

const router = Router();

router.get("/", async (req, res) => {
  return res.send("Index root");
});

router.use("/companies", companyRouter);

export default router;
