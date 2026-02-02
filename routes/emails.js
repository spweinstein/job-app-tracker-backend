const { Router } = require("express");
const controllers = require("../controllers/emails.js");
const paginationMiddleware = require("../middleware/paginationMiddleware.js");

const router = Router();

// Routes
router.get("/", paginationMiddleware(), controllers.renderIndex);

router.get("/new", controllers.renderNewEmailForm);

router.get("/:id", controllers.renderShowEmailPage);

router.get("/:id/edit", controllers.renderEditEmailForm);

router.post("/", controllers.createEmail);

router.delete("/:id", controllers.deleteEmail);

router.put("/:id", controllers.updateEmail);

module.exports = router;
