const Interview = require("../models/interview.js");
const Company = require("../models/company.js");
const JobApp = require("../models/jobApp.js");

// GET "/interviews/"
const renderIndex = async (req, res) => {
  const { page, limit, skip } = res.locals.pagination;
  const { sortBy, sortOrder } = res.locals.sort;
  const filter = {
    user: req.session.user._id,
  };
  const [interviews, totalCount] = await Promise.all([
    Interview.find(filter)
      .populate("company")
      .populate("jobApp")
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit),
    Interview.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalCount / limit);
  console.log(interviews);

  res.render("./interviews/index.ejs", {
    pageTitle: "Interviews",
    interviews,
    pagination: {
      ...res.locals.pagination,
      totalPages,
      totalCount,
    },
  });
};

// GET "/activities/new"
const renderNewInterviewForm = async (req, res) => {
  const companies = await Company.find({
    user: req.session.user._id,
  });
  const jobApps = await JobApp.find({
    user: req.session.user._id,
  });
  res.render("./interviews/new.ejs", {
    pageTitle: "New Interview",
    companies,
    jobApps,
  });
};

// GET "/activities/:id"
const renderShowInterviewPage = async (req, res) => {
  const interview = await Interview.findOne({
    _id: req.params.id,
    user: req.session.user._id,
  })
    .populate("company")
    .populate("jobApp");
  res.render("./interviews/show.ejs", {
    pageTitle: `View Interview`,
    interview: interview,
  });
};

// GET "/activities/:id/edit"
const renderEditInterviewForm = async (req, res) => {
  const interview = await Interview.findOne({
    _id: req.params.id,
    user: req.session.user._id,
  })
    .populate("company")
    .populate("jobApp");
  const companies = await Company.find({
    user: req.session.user._id,
  });
  const jobApps = await JobApp.find({
    user: req.session.user._id,
  });

  res.render("./interviews/edit.ejs", {
    pageTitle: "Edit Interview",
    interview: interview,
    companies,
    jobApps,
  });
};

// POST "/activities/"
const createInterview = async (req, res) => {
  req.body.user = req.session.user._id;

  // Handle startAt date
  if (req.body.startAt === "") {
    delete req.body.startAt;
  } else {
    const date = new Date(req.body.startAt);
    date.setUTCHours(12, 0, 0, 0); // Set to noon UTC
    req.body.startAt = date;
  }

  // Handle endAt date (optional)
  if (req.body.endAt === "") {
    delete req.body.endAt;
  } else if (req.body.endAt) {
    const date = new Date(req.body.endAt);
    date.setUTCHours(12, 0, 0, 0); // Set to noon UTC
    req.body.endAt = date;
  }

  await Interview.create(req.body);
  res.redirect("/interviews");
};

// DELETE "/activities/:id"
const deleteInterview = async (req, res) => {
  const interview = await Interview.findOneAndDelete({
    _id: req.params.id,
    user: req.session.user._id,
  });
  res.redirect("/interviews");
};

// PUT "/activities/:id"
const updateInterview = async (req, res) => {
  // Handle startAt date
  if (req.body.startAt === "") {
    delete req.body.startAt;
  } else {
    const date = new Date(req.body.startAt);
    date.setUTCHours(12, 0, 0, 0); // Set to noon UTC
    req.body.startAt = date;
  }

  // Handle endAt date (optional)
  if (req.body.endAt === "") {
    delete req.body.endAt;
  } else if (req.body.endAt) {
    const date = new Date(req.body.endAt);
    date.setUTCHours(12, 0, 0, 0); // Set to noon UTC
    req.body.endAt = date;
  }

  const interview = await Interview.findOneAndUpdate(
    {
      _id: req.params.id,
      user: req.session.user._id,
    },
    req.body,
  );
  res.redirect(`/interviews/${req.params.id}`);
};

module.exports = {
  renderIndex,
  renderNewInterviewForm,
  renderShowInterviewPage,
  renderEditInterviewForm,
  createInterview,
  deleteInterview,
  updateInterview,
};
