const User = require("../models/user.js");
const Company = require("../models/company.js");
const JobApp = require("../models/jobApp.js");

const renderIndex = async (req, res) => {
  const companies = await Company.find({
    user: req.session.user._id,
  });
  res.render("companies/index.ejs", { companies, pageTitle: "Companies" });
};

const renderNewCompanyForm = (req, res) => {
  res.render("companies/new.ejs", {
    pageTitle: "New Company",
  });
};

const renderShowCompanyPage = async (req, res) => {
  const company = await Company.findOne({
    user: req.session.user._id,
    _id: req.params.id,
  });
  const jobApps = await JobApp.find({
    company: req.params.id,
  });
  res.render("./companies/show.ejs", {
    pageTitle: "Company Details",
    company,
    jobApps,
  });
};

const renderEditCompanyForm = async (req, res) => {
  const company = await Company.findOne({
    user: req.session.user._id,
    _id: req.params.id,
  });
  res.render("./companies/edit.ejs", {
    pageTitle: "Edit Company",
    company,
  });
};

const createCompany = async (req, res) => {
  req.body.user = req.session.user._id;
  await Company.create(req.body);
  res.redirect("/companies");
};

const deleteCompany = async (req, res) => {
  await Company.findOneAndDelete({
    user: req.session.user._id,
    _id: req.params.id,
  });
  res.redirect("/companies");
};

const updateCompany = async (req, res) => {
  const company = await Company.findOneAndUpdate(
    {
      user: req.session.user._id,
      _id: req.params.id,
    },
    req.body,
  );
  res.redirect("/companies");
};

module.exports = {
  renderIndex,
  renderNewCompanyForm,
  renderShowCompanyPage,
  renderEditCompanyForm,
  createCompany,
  deleteCompany,
  updateCompany,
};
