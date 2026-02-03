const { Router } = require("express");
const controllers = require("../controllers/resumeTailorSessions.js");
const paginationMiddleware = require("../middleware/paginationMiddleware.js");

const router = Router();

// Routes
router.get("/", paginationMiddleware(), controllers.renderIndex);

router.get("/new", controllers.renderNewSessionForm);

router.get("/:id", controllers.renderShowSessionPage);

router.get("/:id/accept", controllers.acceptSession);

router.get("/:id/reject", controllers.rejectSession);

// router.get("/:id/edit", controllers.renderEditSessionForm);

router.post("/", controllers.createSession);

router.delete("/:id", controllers.deleteSession);

// router.put("/:id", controllers.updateMeeting);

module.exports = router;
