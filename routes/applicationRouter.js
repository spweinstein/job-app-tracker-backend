import { Router } from "express";
import * as controllers from "../controllers/applicationControllers.js";
import validateBody from "../middleware/validateBody.js";
import {
  applicationCreateBodySchema,
  applicationUpdateBodySchema,
} from "../schemas/applicationSchemas.js";
import { verifyApplicationRefsOwned } from "../middleware/verifyApplicationRefsOwned.js";

const router = Router();

// Routes
router.get("/", controllers.getApplications);

router.get("/stats/dashboard", controllers.getDashboardStats);

router.get("/:id", controllers.getApplication);

router.post(
  "/",
  validateBody(applicationCreateBodySchema),
  verifyApplicationRefsOwned,
  controllers.createApp,
);

router.delete("/:id", controllers.deleteApp);

router.put(
  "/:id",
  validateBody(applicationUpdateBodySchema),
  verifyApplicationRefsOwned,
  controllers.updateApp,
);

export default router;
