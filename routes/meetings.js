const { Router } = require("express");
const controllers = require("../controllers/meetings.js");
const paginationMiddleware = require("../middleware/paginationMiddleware.js");

const router = Router();

// Routes
router.get("/", paginationMiddleware(), controllers.renderIndex);

router.get("/new", controllers.renderNewMeetingForm);

router.get("/:id", controllers.renderShowMeetingPage);

router.get("/:id/edit", controllers.renderEditMeetingForm);

router.post("/", controllers.createMeeting);

router.delete("/:id", controllers.deleteMeeting);

router.put("/:id", controllers.updateMeeting);

module.exports = router;
