const { Router } = require("express");
const controllers = require("../controllers/auth.js");

const router = Router();

// Put all auth routes here
router.get("/register", controllers.renderRegistrationForm);
router.post("/register", controllers.registerUser);
router.get("/login", controllers.renderLoginForm);
router.post("/login", controllers.loginUser);
router.get("/logout", controllers.logoutUser);

module.exports = router;
