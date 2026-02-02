const { Router } = require("express");
const controllers = require("../controllers/interviews.js");
const paginationMiddleware = require("../middleware/paginationMiddleware.js");

const router = Router();

// Routes
router.get("/", paginationMiddleware(), controllers.renderIndex);

router.get("/new", controllers.renderNewInterviewForm);

router.get("/:id", controllers.renderShowInterviewPage);

router.get("/:id/edit", controllers.renderEditInterviewForm);

router.post("/", controllers.createInterview);

router.delete("/:id", controllers.deleteInterview);

router.put("/:id", controllers.updateInterview);

module.exports = router;
