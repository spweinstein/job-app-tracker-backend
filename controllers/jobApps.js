const User = require("../models/user.js");
const JobApp = require("../models/jobApp.js");

const renderIndex = async (req, res) => {
  const jobApps = await JobApp.find();
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
  const jobApp = await JobApp.findById(req.params.id);
  console.log(jobApp);
  res.render("./jobApps/show.ejs", {
    pageTitle: `View Job App`,
    jobApp,
  });
};

const renderEditAppForm = async (req, res) => {
  const jobApp = await JobApp.findById(req.params.id);
  console.log(jobApp);
  res.render("./jobApps/edit.ejs", {
    pageTitle: "Edit Job App",
    jobApp,
  });
};

const createApp = async (req, res) => {
  console.log(req.body);
  req.body.archived = req.body.archived === "on" ? true : false;
  await JobApp.create(req.body);
  res.redirect("/jobApps");
};

const deleteApp = async (req, res) => {
  await JobApp.findByIdAndDelete(req.params.id);
  res.redirect("/jobApps");
};

const updateApp = async (req, res) => {
  console.log(req.body);
  req.body.archived = req.body.archived === "on" ? true : false;
  await JobApp.findByIdAndUpdate(req.params.id, req.body);
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
