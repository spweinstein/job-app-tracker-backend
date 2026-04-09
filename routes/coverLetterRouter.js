import { Router } from "express";
import * as controllers from "../controllers/coverLetterControllers.js";
import validateBody from "../middleware/validateBody.js";
import {
  coverLetterCreateBodySchema,
  coverLetterUpdateBodySchema,
} from "../schemas/coverLetterSchemas.js";
import { verifyCoverLetterParentOwned } from "../middleware/verifyParentOwned.js";

const router = Router();

router.get("/", controllers.getCoverLetters);
router.post(
  "/",
  validateBody(coverLetterCreateBodySchema),
  verifyCoverLetterParentOwned,
  controllers.createCoverLetter,
);
router.get("/:id", controllers.getCoverLetter);
router.delete("/:id", controllers.deleteCoverLetter);
router.put(
  "/:id",
  validateBody(coverLetterUpdateBodySchema),
  verifyCoverLetterParentOwned,
  controllers.updateCoverLetter,
);

export default router;
