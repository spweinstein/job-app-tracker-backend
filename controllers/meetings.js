const Meeting = require("../models/meeting.js");
const Company = require("../models/company.js");
const JobApp = require("../models/jobApp.js");

// GET "/meetings/"
const renderIndex = async (req, res) => {
  const { page, limit, skip } = res.locals.pagination;
  const { sortBy, sortOrder } = res.locals.sort;
  const filter = {
    user: req.session.user._id,
  };
  const [meetings, totalCount] = await Promise.all([
    Meeting.find(filter)
      .populate("company")
      .populate("jobApp")
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit),
    Meeting.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalCount / limit);
  console.log(meetings);

  res.render("./meetings/index.ejs", {
    pageTitle: "Meetings",
    meetings: meetings,
    pagination: {
      ...res.locals.pagination,
      totalPages,
      totalCount,
    },
  });
};

// GET "/meetings/new"
const renderNewMeetingForm = async (req, res) => {
  const companies = await Company.find({
    user: req.session.user._id,
  });
  const jobApps = await JobApp.find({
    user: req.session.user._id,
  });
  res.render("./meetings/new.ejs", {
    pageTitle: "New Meeting",
    companies,
    jobApps,
  });
};

// GET "/meetings/:id"
const renderShowMeetingPage = async (req, res) => {
  const meeting = await Meeting.findOne({
    _id: req.params.id,
    user: req.session.user._id,
  })
    .populate("company")
    .populate("jobApp");
  res.render("./meetings/show.ejs", {
    pageTitle: `View Meeting`,
    activity: meeting,
  });
};

// GET "/meetings/:id/edit"
const renderEditMeetingForm = async (req, res) => {
  const meeting = await Meeting.findOne({
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

  res.render("./meetings/edit.ejs", {
    pageTitle: "Edit Meeting",
    activity: meeting,
    companies,
    jobApps,
  });
};

// POST "/meetings/"
const createMeeting = async (req, res) => {
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

  await Meeting.create(req.body);
  res.redirect("/meetings");
};

// DELETE "/meetings/:id"
const deleteMeeting = async (req, res) => {
  const meeting = await Meeting.findOneAndDelete({
    _id: req.params.id,
    user: req.session.user._id,
  });
  res.redirect("/meetings");
};

// PUT "/meetings/:id"
const updateMeeting = async (req, res) => {
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

  const meeting = await Meeting.findOneAndUpdate(
    {
      _id: req.params.id,
      user: req.session.user._id,
    },
    req.body,
  );
  res.redirect(`/meetings/${req.params.id}`);
};

module.exports = {
  renderIndex,
  renderNewMeetingForm,
  renderShowMeetingPage,
  renderEditMeetingForm,
  createMeeting,
  deleteMeeting,
  updateMeeting,
};
