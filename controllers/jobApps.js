const User = require("../models/user.js");
const JobApp = require("../models/jobApp.js");

const renderIndex = async (req, res) => {
  const jobApps = await JobApp.find({
    user: req.session.user._id,
  });
  res.render("./jobApps/index.ejs", {
    pageTitle: "Job Applications",
    jobApps,
  });
};

const renderNewAppForm = (req, res) => {
  res.render("./jobApps/new.ejs", {
    pageTitle: "New Job Application",
  });
};

const renderShowAppPage = async (req, res) => {
  const jobApp = await JobApp.findOne({
    _id: req.params.id,
    user: req.session.user._id,
  });
  //   console.log(jobApp);
  res.render("./jobApps/show.ejs", {
    pageTitle: `View Job App`,
    jobApp,
  });
};

const renderEditAppForm = async (req, res) => {
  const jobApp = await JobApp.findOne({
    _id: req.params.id,
    user: req.session.user._id,
  });
  //   console.log(jobApp);
  res.render("./jobApps/edit.ejs", {
    pageTitle: "Edit Job App",
    jobApp,
  });
};

const createApp = async (req, res) => {
  //   console.log(req.body);
  req.body.archived = req.body.archived === "on" ? true : false;
  req.body.user = req.session.user._id;
  // Remove appliedAt if it's an empty string
  if (req.body.appliedAt === "") {
    delete req.body.appliedAt;
  } else {
    const date = new Date(req.body.appliedAt);
    date.setUTCHours(12, 0, 0, 0); // Set to noon UTC
    req.body.appliedAt = date;
  }
  await JobApp.create(req.body);
  res.redirect("/jobApps");
};

const deleteApp = async (req, res) => {
  const jobApp = await JobApp.findOneAndDelete({
    _id: req.params.id,
    user: req.session.user._id,
  });
  res.redirect("/jobApps");
};

const updateApp = async (req, res) => {
  console.log(req.body);
  req.body.archived = req.body.archived === "on" ? true : false;
  //   await JobApp.findByIdAndUpdate(req.params.id, req.body);
  // Remove appliedAt if it's an empty string
  if (req.body.appliedAt === "") {
    delete req.body.appliedAt;
  } else {
    const date = new Date(req.body.appliedAt);
    date.setUTCHours(12, 0, 0, 0); // Set to noon UTC
    req.body.appliedAt = date;
  }
  const jobApp = await JobApp.findOneAndUpdate(
    {
      _id: req.params.id,
      user: req.session.user._id,
    },
    req.body,
  );
  res.redirect(`/jobApps/${req.params.id}`);
};

module.exports = {
  renderIndex,
  renderNewAppForm,
  renderShowAppPage,
  renderEditAppForm,
  createApp,
  deleteApp,
  updateApp,
};
