import { Router } from "express";
import * as controllers from "../controllers/applicationControllers.js";

const router = Router();

// Routes
router.get("/", controllers.getApplications);

router.get("/:id", controllers.getApplication);

router.post("/", controllers.createApp);

router.delete("/:id", controllers.deleteApp);

router.put("/:id", controllers.updateApp);

router.get("/stats/dashboard", controllers.getDashboardStats);

export default router;
