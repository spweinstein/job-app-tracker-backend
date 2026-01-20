const User = require("../models/user.js");
const Company = require("../models/company.js");

const renderIndex = async (req, res) => {
  const companies = await Company.find({
    user: req.session.user._id,
  });
  res.render("company/index.ejs", { companies });
};

const renderNewCompanyForm = (req, res) => {};

const renderShowCompanyPage = (req, res) => {};

const renderEditCompanyForm = (req, res) => {};

const createCompany = (req, res) => {};

const deleteCompany = (req, res) => {};
const updateCompany = (req, res) => {};

module.exports = {
  renderIndex,
  renderNewCompanyForm,
  renderShowCompanyPage,
  renderEditCompanyForm,
  createCompany,
  deleteCompany,
  updateCompany,
};
