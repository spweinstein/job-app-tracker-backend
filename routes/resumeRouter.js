import { Router } from "express";
import * as controllers from "../controllers/resumeControllers.js";
import validateBody from "../middleware/validateBody.js";
import {
  resumeCreateBodySchema,
  resumeUpdateBodySchema,
} from "../schemas/resumeSchemas.js";

const router = Router();

// GET /resumes/
router.get("/", controllers.getResumes);
router.post(
  "/",
  validateBody(resumeCreateBodySchema),
  controllers.createResume,
);
router.put(
  "/:id",
  validateBody(resumeUpdateBodySchema),
  controllers.updateResume,
);
router.get("/:id", controllers.getResume);
router.delete("/:id", controllers.deleteResume);

export default router;
