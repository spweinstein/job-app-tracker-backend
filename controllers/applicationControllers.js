import Application from "../models/applicationModel.js";
import Company from "../models/companyModel.js";
import Resume from "../models/resumeModel.js";

// GET "/jobApps/"
const getApplications = async (req, res) => {
  try {
    const baseFilter = { user: req.user._id };
    if (req.query.company) baseFilter.company = req.query.company;

    const result = await Application.paginate(req, baseFilter, {
      populate: ["company", "resume"],
      searchFields: ["title"],
    });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// GET "/jobApps/:id"
const getApplication = async (req, res) => {
  try {
    const jobApp = await Application.findOne({
      _id: req.params.id,
      user: req.user._id,
    })
      .populate("company")
      .populate("resume");
    res.json(jobApp);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// POST "/jobApps/"
const createApp = async (req, res) => {
  try {
    req.body.user = req.user._id;
    // Remove appliedAt if it's an empty string
    if (req.body.appliedAt === "") {
      delete req.body.appliedAt;
    } else {
      const date = new Date(req.body.appliedAt);
      date.setUTCHours(12, 0, 0, 0); // Set to noon UTC
      req.body.appliedAt = date;
    }
    const jobApp = await Application.create(req.body);
    res.status(201).json(jobApp);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// DELETE "/jobApps/:id"
const deleteApp = async (req, res) => {
  try {
    await Application.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// PUT "/jobApps/:id"
const updateApp = async (req, res) => {
  try {
    // Remove appliedAt if it's an empty string
    if (req.body.appliedAt === "") {
      delete req.body.appliedAt;
    } else {
      const date = new Date(req.body.appliedAt);
      date.setUTCHours(12, 0, 0, 0); // Set to noon UTC
      req.body.appliedAt = date;
    }
    const jobApp = await Application.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id,
      },
      req.body,
      { new: true },
    );
    res.json(jobApp);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export { getApplication, getApplications, createApp, deleteApp, updateApp };
