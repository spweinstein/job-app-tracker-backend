const User = require("../models/user.js");
const Resume = require("../models/resume.js");
const JobApp = require("../models/jobApp.js");
const ResumeTailorSession = require("../models/resumeTailorSession.js");

// GET "/resumeTailorSessions/"
const renderIndex = async (req, res) => {
  //   res.send("Resume tailor sessions index page (TBU)");

  const { page, limit, skip } = res.locals.pagination;
  const { sortBy, sortOrder } = res.locals.sort;
  const filter = { user: req.session.user._id };

  const [sessions, totalCount] = await Promise.all([
    ResumeTailorSession.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit),
    ResumeTailorSession.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  res.render("./resumeTailorSessions/index.ejs", {
    pageTitle: "Resume AI Tailoring Sessions",
    sessions,
    pagination: {
      ...res.locals.pagination,
      totalPages,
      totalCount,
    },
  });
};

// GET "/resumeTailorSessions/new"
const renderNewSessionForm = async (req, res) => {
  res.send("New resume tailor session form (TBU)");
};

// POST "/resumeTailorSessions/"
const createSession = async (req, res) => {
  res.send("Create resume tailor session endpoint (TBU)");
};

// GET "/resumeTailorSessions/:id"
const renderShowSessionPage = async (req, res) => {
  res.send("Show resume tailor session page (TBU)");
};

// GET "/resumeTailorSessions/:id/accept"
const acceptSession = async (req, res) => {
  res.send("Accept resume tailor session changes (TBU)");
};

// GET "/resumeTailorSessions/:id/reject"
const rejectSession = async (req, res) => {
  res.send("Reject resume tailor session changes (TBU)");
};

// DELETE "/resumeTailorSessions/:id"
const deleteSession = async (req, res) => {
  res.send("Delete resume tailor session endpoint (TBU)");
};

module.exports = {
  renderIndex,
  renderNewSessionForm,
  createSession,
  renderShowSessionPage,
  acceptSession,
  rejectSession,
  deleteSession,
};
