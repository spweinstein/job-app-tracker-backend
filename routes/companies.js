const { Router } = require("express");
const controllers = require("../controllers/companies.js");

const router = Router();

router.get("/", controllers.renderIndex);

module.exports = router;
