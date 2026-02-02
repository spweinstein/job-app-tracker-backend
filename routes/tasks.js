const { Router } = require("express");
const controllers = require("../controllers/tasks.js");
const paginationMiddleware = require("../middleware/paginationMiddleware.js");

const router = Router();

// Routes
router.get("/", paginationMiddleware(), controllers.renderIndex);

router.get("/new", controllers.renderNewTaskForm);

router.get("/:id", controllers.renderShowTaskPage);

router.get("/:id/edit", controllers.renderEditTaskForm);

router.post("/", controllers.createTask);

router.delete("/:id", controllers.deleteTask);

router.put("/:id", controllers.updateTask);

module.exports = router;
