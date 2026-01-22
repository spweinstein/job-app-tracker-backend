const { Router } = require("express");
const controllers = require("../controllers/resumes.js");
const router = Router();

// GET /resumes/
router.get("/", controllers.renderIndex);
router.get("/new", controllers.renderNewResumeForm);
router.post("/", controllers.createResume);
// router.put("/:id/edit", controllers.updateResume);
// router.get("/:id", controllers.showResume);

module.exports = router;
