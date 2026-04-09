import CoverLetter from "../models/coverLetterModel.js";
import Resume from "../models/resumeModel.js";
import Company from "../models/companyModel.js";

// Prevent users from revealing information about other users' documents
// by creating applications with documents that are not theirs
export const verifyApplicationRefsOwned = async (req, res, next) => {
  // Check if the cover letter used exists and is this user's
  if (req.body.coverLetter) {
    const coverLetter = await CoverLetter.findById(req.body.coverLetter);
    if (!coverLetter) {
      res.status(404).json({ error: "Cover letter not found" });
      return false;
    } else if (!coverLetter.owner.equals(req.user._id)) {
      res.status(403).json({
        error:
          "You are not authorized to use this cover letter for an application",
      });
      return false;
    }
    req.body.coverLetter = coverLetter._id;
  }
  // Check if the resume used exists and is this user's
  if (req.body.resume) {
    const resume = await Resume.findById(req.body.resume);
    if (!resume) {
      res.status(404).json({ error: "Resume not found" });
      return false;
    } else if (!resume.owner.equals(req.user._id)) {
      res.status(403).json({
        error: "You are not authorized to use this resume for an application",
      });
      return false;
    }
    req.body.resume = resume._id;
  }
  // Check if the company used exists and is this user's
  if (req.body.company) {
    const company = await Company.findById(req.body.company);
    if (!company) {
      res.status(404).json({ error: "Company not found" });
      return false;
    } else if (!company.author.equals(req.user._id)) {
      res.status(403).json({
        error: "You are not authorized to use this company for an application",
      });
      return false;
    }
    req.body.company = company._id;
  }
  next();
};
