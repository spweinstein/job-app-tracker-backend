import { Router } from "express";
import * as controllers from "../controllers/coverLetterControllers.js";

const router = Router();

router.get("/", controllers.getCoverLetters);
router.post("/", controllers.createCoverLetter);
router.get("/:id", controllers.getCoverLetter);
router.delete("/:id", controllers.deleteCoverLetter);
router.put("/:id", controllers.updateCoverLetter);

export default router;
