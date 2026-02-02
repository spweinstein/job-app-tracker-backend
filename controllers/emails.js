const Email = require("../models/email.js");
const Company = require("../models/company.js");
const JobApp = require("../models/jobApp.js");

// GET "/emails/"
const renderIndex = async (req, res) => {
  const { page, limit, skip } = res.locals.pagination;
  const { sortBy, sortOrder } = res.locals.sort;
  const filter = {
    user: req.session.user._id,
  };
  const [emails, totalCount] = await Promise.all([
    Email.find(filter)
      .populate("company")
      .populate("jobApp")
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit),
    Email.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalCount / limit);
  console.log(emails);

  res.render("./emails/index.ejs", {
    pageTitle: "Emails",
    emails: emails,
    pagination: {
      ...res.locals.pagination,
      totalPages,
      totalCount,
    },
  });
};

// GET "/emails/new"
const renderNewEmailForm = async (req, res) => {
  const companies = await Company.find({
    user: req.session.user._id,
  });
  const jobApps = await JobApp.find({
    user: req.session.user._id,
  });
  res.render("./emails/new.ejs", {
    pageTitle: "New Email",
    companies,
    jobApps,
  });
};

// GET "/emails/:id"
const renderShowEmailPage = async (req, res) => {
  const email = await Email.findOne({
    _id: req.params.id,
    user: req.session.user._id,
  })
    .populate("company")
    .populate("jobApp");
  res.render("./emails/show.ejs", {
    pageTitle: `View Email`,
    activity: email,
  });
};

// GET "/emails/:id/edit"
const renderEditEmailForm = async (req, res) => {
  const email = await Email.findOne({
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

  res.render("./emails/edit.ejs", {
    pageTitle: "Edit Email",
    activity: email,
    companies,
    jobApps,
  });
};

// POST "/emails/"
const createEmail = async (req, res) => {
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

  await Email.create(req.body);
  res.redirect("/emails");
};

// DELETE "/emails/:id"
const deleteEmail = async (req, res) => {
  const email = await Email.findOneAndDelete({
    _id: req.params.id,
    user: req.session.user._id,
  });
  res.redirect("/emails");
};

// PUT "/emails/:id"
const updateEmail = async (req, res) => {
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

  const email = await Email.findOneAndUpdate(
    {
      _id: req.params.id,
      user: req.session.user._id,
    },
    req.body,
  );
  res.redirect(`/emails/${req.params.id}`);
};

module.exports = {
  renderIndex,
  renderNewEmailForm,
  renderShowEmailPage,
  renderEditEmailForm,
  createEmail,
  deleteEmail,
  updateEmail,
};
