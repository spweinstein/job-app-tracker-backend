const { Router } = require("express");
const authRoutes = require("./auth.js");
const jobAppRoutes = require("./jobApps.js");
const companyRoutes = require("./companies.js");
const resumeRoutes = require("./resumes.js");
const coverLetterRoutes = require("./coverLetters.js");
const interviewRoutes = require("./interviews.js");
const taskRoutes = require("./tasks.js");
const callRoutes = require("./calls.js");
const emailRoutes = require("./emails.js");
const meetingRoutes = require("./meetings.js");
const resumeTailorSessionRoutes = require("./resumeTailorSessions.js");

const authMiddlewares = require("../middleware/authMiddlewares.js");

const router = Router();

router.get("/", (req, res) => {
  res.render("index.ejs", {
    pageTitle: "Job Application Tracker",
  });
});

router.use("/auth", authRoutes);
router.use(
  "/jobApps",
  authMiddlewares.isSignedIn,
  authMiddlewares.isAbleToAccessJobApps,
  jobAppRoutes,
);
router.use("/companies", authMiddlewares.isSignedIn, companyRoutes);
router.use("/resumes", authMiddlewares.isSignedIn, resumeRoutes);
router.use("/coverLetters", authMiddlewares.isSignedIn, coverLetterRoutes);

router.use("/interviews", authMiddlewares.isSignedIn, interviewRoutes);
router.use("/tasks", authMiddlewares.isSignedIn, taskRoutes);
router.use("/calls", authMiddlewares.isSignedIn, callRoutes);
router.use("/emails", authMiddlewares.isSignedIn, emailRoutes);
router.use("/meetings", authMiddlewares.isSignedIn, meetingRoutes);
router.use(
  "/resumeTailorSessions",
  authMiddlewares.isSignedIn,
  resumeTailorSessionRoutes,
);
module.exports = router;
