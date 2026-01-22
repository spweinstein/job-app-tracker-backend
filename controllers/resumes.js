const Resume = require("../models/resume.js");

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

const renderNewResumeForm = (req, res) => {
  res.render("./resumes/new.ejs", {
    pageTitle: "Add Resume",
  });
};

const createResume = async (req, res) => {
  req.body.user = req.session.user._id;
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

module.exports = {
  renderIndex,
  renderNewResumeForm,
  createResume,
  updateResume,
};
