const Call = require("../models/call.js");
const Company = require("../models/company.js");
const JobApp = require("../models/jobApp.js");

// GET "/calls/"
const renderIndex = async (req, res) => {
  const { page, limit, skip } = res.locals.pagination;
  const { sortBy, sortOrder } = res.locals.sort;
  const filter = {
    user: req.session.user._id,
  };
  const [calls, totalCount] = await Promise.all([
    Call.find(filter)
      .populate("company")
      .populate("jobApp")
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit),
    Call.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalCount / limit);
  console.log(calls);

  res.render("./calls/index.ejs", {
    pageTitle: "Calls",
    calls: calls,
    pagination: {
      ...res.locals.pagination,
      totalPages,
      totalCount,
    },
  });
};

// GET "/calls/new"
const renderNewCallForm = async (req, res) => {
  const companies = await Company.find({
    user: req.session.user._id,
  });
  const jobApps = await JobApp.find({
    user: req.session.user._id,
  });
  res.render("./calls/new.ejs", {
    pageTitle: "New Call",
    companies,
    jobApps,
  });
};

// GET "/calls/:id"
const renderShowCallPage = async (req, res) => {
  const call = await Call.findOne({
    _id: req.params.id,
    user: req.session.user._id,
  })
    .populate("company")
    .populate("jobApp");
  res.render("./calls/show.ejs", {
    pageTitle: `View Call`,
    activity: call,
  });
};

// GET "/calls/:id/edit"
const renderEditCallForm = async (req, res) => {
  const call = await Call.findOne({
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

  res.render("./calls/edit.ejs", {
    pageTitle: "Edit Call",
    activity: call,
    companies,
    jobApps,
  });
};

// POST "/calls/"
const createCall = async (req, res) => {
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

  await Call.create(req.body);
  res.redirect("/calls");
};

// DELETE "/calls/:id"
const deleteCall = async (req, res) => {
  const call = await Call.findOneAndDelete({
    _id: req.params.id,
    user: req.session.user._id,
  });
  res.redirect("/calls");
};

// PUT "/calls/:id"
const updateCall = async (req, res) => {
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

  const call = await Call.findOneAndUpdate(
    {
      _id: req.params.id,
      user: req.session.user._id,
    },
    req.body,
  );
  res.redirect(`/calls/${req.params.id}`);
};

module.exports = {
  renderIndex,
  renderNewCallForm,
  renderShowCallPage,
  renderEditCallForm,
  createCall,
  deleteCall,
  updateCall,
};
