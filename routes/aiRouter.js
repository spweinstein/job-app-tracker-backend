import { Router } from "express";
import * as controllers from "../controllers/aiControllers.js";

const router = Router();

router.post("/threads", controllers.createThread);
router.get("/threads/:threadId", controllers.getThread);
router.get("/threads/:threadId/messages", controllers.getMessages);
router.post("/threads/:threadId/messages", controllers.postMessage);

export default router;

