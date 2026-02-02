const Task = require("../models/task.js");
const Company = require("../models/company.js");
const JobApp = require("../models/jobApp.js");

// GET "/tasks/"
const renderIndex = async (req, res) => {
  const { page, limit, skip } = res.locals.pagination;
  const { sortBy, sortOrder } = res.locals.sort;
  const filter = {
    user: req.session.user._id,
  };
  const [tasks, totalCount] = await Promise.all([
    Task.find(filter)
      .populate("company")
      .populate("jobApp")
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit),
    Task.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalCount / limit);
  console.log(tasks);

  res.render("./tasks/index.ejs", {
    pageTitle: "Tasks",
    tasks: tasks,
    pagination: {
      ...res.locals.pagination,
      totalPages,
      totalCount,
    },
  });
};

// GET "/tasks/new"
const renderNewTaskForm = async (req, res) => {
  const companies = await Company.find({
    user: req.session.user._id,
  });
  const jobApps = await JobApp.find({
    user: req.session.user._id,
  });
  res.render("./tasks/new.ejs", {
    pageTitle: "New Task",
    companies,
    jobApps,
  });
};

// GET "/tasks/:id"
const renderShowTaskPage = async (req, res) => {
  const task = await Task.findOne({
    _id: req.params.id,
    user: req.session.user._id,
  })
    .populate("company")
    .populate("jobApp");
  res.render("./tasks/show.ejs", {
    pageTitle: `View Task`,
    activity: task,
  });
};

// GET "/tasks/:id/edit"
const renderEditTaskForm = async (req, res) => {
  const task = await Task.findOne({
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

  res.render("./tasks/edit.ejs", {
    pageTitle: "Edit Task",
    activity: task,
    companies,
    jobApps,
  });
};

// POST "/tasks/"
const createTask = async (req, res) => {
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

  await Task.create(req.body);
  res.redirect("/tasks");
};

// DELETE "/tasks/:id"
const deleteTask = async (req, res) => {
  const task = await Task.findOneAndDelete({
    _id: req.params.id,
    user: req.session.user._id,
  });
  res.redirect("/tasks");
};

// PUT "/tasks/:id"
const updateTask = async (req, res) => {
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

  const task = await Task.findOneAndUpdate(
    {
      _id: req.params.id,
      user: req.session.user._id,
    },
    req.body,
  );
  res.redirect(`/tasks/${req.params.id}`);
};

module.exports = {
  renderIndex,
  renderNewTaskForm,
  renderShowTaskPage,
  renderEditTaskForm,
  createTask,
  deleteTask,
  updateTask,
};
