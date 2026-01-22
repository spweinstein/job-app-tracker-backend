const Resume = require("../models/resume.js");
const Company = require("../models/company.js");

const renderIndex = async (req, res) => {
  const resumes = await Resume.find({
    user: req.session.user._id,
  });
  console.log(resumes);
  //   await Resume.populate(resumes, { path: "user" });
  res.render("./resumes/index.ejs", {
    pageTitle: "Resumes",
    resumes,
  });
};

const renderNewResumeForm = async (req, res) => {
  const companies = await Company.find({
    user: req.session.user._id,
  });
  res.render("./resumes/new.ejs", {
    pageTitle: "Add Resume",
    companies,
  });
};

const renderEditResumeForm = async (req, res) => {
  const resume = await Resume.findOne({
    _id: req.params.id,
    user: req.session.user._id,
  });
  console.log(resume);
  res.render("./resumes/edit.ejs", {
    pageTitle: "Edit Resume",
    resume,
  });
};

const createResume = async (req, res) => {
  req.body.user = req.session.user._id;
  console.log(req.body);

  //   for (const experience of req.body.experience) {
  //     if (experience.startDate === "") {
  //       delete experience.startDate;
  //     } else {
  //       const date = new Date(experience.startDate);
  //       date.setUTCHours(12, 0, 0, 0); // Set to noon UTC
  //       experience.startDate = date;
  //     }

  //     if (experience.endDate === "") {
  //       delete experience.endDate;
  //     } else {
  //       const date = new Date(experience.endDate);
  //       date.setUTCHours(12, 0, 0, 0); // Set to noon UTC
  //       experience.endDate = date;
  //     }
  //   }

  console.log(req.body);

  await Resume.create(req.body);
  res.redirect("/resumes");
};

const updateResume = async (req, res) => {
  await Resume.findOneAndUpdate(
    {
      user: req.session.user._id,
      _id: req.params.id,
    },
    req.body,
  );
  res.redirect(`./resumes/${req.params.id}`);
};

const showResume = async (req, res) => {
  const resume = await Resume.findOne({
    user: req.session.user._id,
    _id: req.params.id,
  });
  res.render("resumes/show.ejs", {
    resume,
    pageTitle: "Resume Details",
  });
};

const deleteResume = async (req, res) => {
  await Resume.findOneAndDelete({
    _id: req.params.id,
    user: req.session.user._id,
  });
  res.redirect("../resumes");
};

module.exports = {
  renderIndex,
  renderNewResumeForm,
  renderEditResumeForm,
  createResume,
  updateResume,
  showResume,
  deleteResume,
};
