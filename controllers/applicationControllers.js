import Application from "../models/applicationModel.js";
import Company from "../models/companyModel.js";
import Resume from "../models/resumeModel.js";
import CoverLetter from "../models/coverLetterModel.js";
import mongoose from "mongoose";
const SORT_ALLOW_LIST = ["updatedAt", "createdAt", "title", "appliedAt"];

// GET "/jobApps/"
export const getApplications = async (req, res) => {
  try {
    const baseFilter = { user: req.user._id };
    if (req.query.company) baseFilter.company = req.query.company;
    if (req.query.resume) baseFilter.resume = req.query.resume;
    if (req.query.coverLetter) baseFilter.coverLetter = req.query.coverLetter;
    if (req.query.status) baseFilter.status = req.query.status;

    const result = await Application.paginate(
      req,
      baseFilter,
      // SORT_ALLOW_LIST,
      {
        sortAllowList: SORT_ALLOW_LIST,
        populate: ["company", "resume"],
        searchFields: ["title"],
      },
    );

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// GET "/jobApps/:id"
export const getApplication = async (req, res) => {
  try {
    const jobApp = await Application.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate([
      { path: "company", select: "name" },
      { path: "resume", select: "name" },
      { path: "coverLetter", select: "name" },
    ]);

    if (!jobApp) {
      return res.status(404).json({ error: "Application not found" });
    }

    res.json(jobApp);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// POST "/jobApps/"
export const createApp = async (req, res) => {
  try {
    req.body.user = req.user?._id;

    // Remove appliedAt if it's not provided
    if (!req.body.appliedAt) {
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
export const deleteApp = async (req, res) => {
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
export const updateApp = async (req, res) => {
  try {
    // Remove appliedAt if it's not provided
    if (!req.body.appliedAt) {
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
    if (!jobApp) {
      return res.status(404).json({ error: "Application not found" });
    }
    res.status(200).json(jobApp);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// GET "/jobApps/stats/dashboard"
export const getDashboardStats = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);
    const baseFilter = { user: userId };

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    weekAgo.setUTCHours(0, 0, 0, 0);

    const bucketArrayToObject = (rows) => {
      return rows.reduce((acc, { _id, count }) => {
        acc[_id] = count;
        return acc;
      }, {});
    };

    const m = await Application.aggregate([
      { $match: baseFilter },
      { $count: "c" },
    ]);
    console.log("aggregate match count", bucketArrayToObject(m));

    // Calculate total
    const total = await Application.countDocuments(baseFilter);
    const totalThisWeek = await Application.countDocuments({
      ...baseFilter,
      appliedAt: { $gte: weekAgo },
    });
    // Calculate by status (all-time)
    const byStatus = bucketArrayToObject(
      await Application.aggregate([
        { $match: baseFilter },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
    );
    console.log("byStatus", byStatus);

    // Calculate by status this week (based on appliedAt)
    const byStatusThisWeek = bucketArrayToObject(
      await Application.aggregate([
        { $match: baseFilter },
        { $match: { appliedAt: { $gte: weekAgo } } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
    );

    // Calculate by source (all-time)
    const bySource = bucketArrayToObject(
      await Application.aggregate([
        { $match: baseFilter },
        { $group: { _id: "$source", count: { $sum: 1 } } },
      ]),
    );

    // Stats with an agg pipeline:

    res.json({
      total,
      totalThisWeek,
      byStatus,
      byStatusThisWeek,
      bySource,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
