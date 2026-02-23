import { Router } from "express";
import * as controllers from "../controllers/resumeControllers.js";

const router = Router();

// GET /resumes/
router.get("/", controllers.getResumes);
router.post("/", controllers.createResume);
router.put("/:id", controllers.updateResume);
router.get("/:id", controllers.getResume);
router.delete("/:id", controllers.deleteResume);
router.post("/:id/export", controllers.exportResumePDF);

export default router;
