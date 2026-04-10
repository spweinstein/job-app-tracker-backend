import { Router } from "express";
import * as controllers from "../controllers/resumeControllers.js";
import validateBody from "../middleware/validateBody.js";
import {
  resumeCreateBodySchema,
  resumeUpdateBodySchema,
} from "../schemas/resumeSchemas.js";
import { verifyResumeParentOwned } from "../middleware/verifyParentOwned.js";

const router = Router();

// GET /resumes/
router.get("/", controllers.getResumes);
router.post(
  "/",
  validateBody(resumeCreateBodySchema),
  verifyResumeParentOwned,
  controllers.createResume,
);
router.put(
  "/:id",
  validateBody(resumeUpdateBodySchema),
  verifyResumeParentOwned,
  controllers.updateResume,
);
router.get("/:id", controllers.getResume);
router.delete("/:id", controllers.deleteResume);

export default router;
