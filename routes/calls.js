const { Router } = require("express");
const controllers = require("../controllers/calls.js");
const paginationMiddleware = require("../middleware/paginationMiddleware.js");

const router = Router();

// Routes
router.get("/", paginationMiddleware(), controllers.renderIndex);

router.get("/new", controllers.renderNewCallForm);

router.get("/:id", controllers.renderShowCallPage);

router.get("/:id/edit", controllers.renderEditCallForm);

router.post("/", controllers.createCall);

router.delete("/:id", controllers.deleteCall);

router.put("/:id", controllers.updateCall);

module.exports = router;
