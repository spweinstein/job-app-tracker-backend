// ai/toolHandlers.js

import Application from "../models/applicationModel.js";
import Resume from "../models/resumeModel.js";
import CoverLetter from "../models/coverLetterModel.js";
import Company from "../models/companyModel.js";
import mongoose from "mongoose";

/**
 * Execute a tool call and return the result
 */
export async function executeTool(toolName, args, userId) {
  try {
    switch (toolName) {
      case "get_applications":
        return await getApplications(args, userId);
      case "get_application":
        return await getApplication(args, userId);
      case "get_resumes":
        return await getResumes(args, userId);
      case "get_resume":
        return await getResume(args, userId);
      case "get_cover_letters":
        return await getCoverLetters(args, userId);
      case "get_cover_letter":
        return await getCoverLetter(args, userId);
      default:
        return { error: `Unknown tool: ${toolName}` };
    }
  } catch (error) {
    console.error(`Error executing tool ${toolName}:`, error);
    return { error: error.message };
  }
}

async function getApplications(args, userId) {
  const { status, company, search, limit = 10 } = args || {};
  const maxLimit = Math.min(limit || 10, 50);
  
  const filter = { user: userId };
  if (status) filter.status = status;
  if (company && mongoose.Types.ObjectId.isValid(company)) {
    filter.company = company;
  }
  
  const query = Application.find(filter)
    .populate("company", "name")
    .populate("resume", "name")
    .populate("coverLetter", "name")
    .limit(maxLimit)
    .sort({ appliedAt: -1 });
  
  if (search) {
    query.regex("title", new RegExp(search, "i"));
  }
  
  const applications = await query;
  
  return {
    applications: applications.map(app => ({
      _id: app._id,
      title: app.title,
      company: app.company?.name || "Unknown",
      status: app.status,
      priority: app.priority,
      source: app.source,
      appliedAt: app.appliedAt,
      resume: app.resume?.name || null,
      coverLetter: app.coverLetter?.name || null
    })),
    count: applications.length
  };
}

async function getApplication(args, userId) {
  const { applicationId } = args;
  
  if (!mongoose.Types.ObjectId.isValid(applicationId)) {
    return { error: "Invalid application ID" };
  }
  
  const application = await Application.findOne({
    _id: applicationId,
    user: userId
  }).populate([
    { path: "company", select: "name" },
    { path: "resume", select: "name" },
    { path: "coverLetter", select: "name" }
  ]);
  
  if (!application) {
    return { error: "Application not found" };
  }
  
  return {
    _id: application._id,
    title: application.title,
    company: application.company?.name || "Unknown",
    status: application.status,
    priority: application.priority,
    source: application.source,
    appliedAt: application.appliedAt,
    url: application.url,
    resume: application.resume?.name || null,
    coverLetter: application.coverLetter?.name || null
  };
}

async function getResumes(args, userId) {
  const { search, limit = 10 } = args || {};
  const maxLimit = Math.min(limit || 10, 50);
  
  const filter = { owner: userId };
  const query = Resume.find(filter)
    .limit(maxLimit)
    .sort({ updatedAt: -1 });
  
  if (search) {
    query.regex("name", new RegExp(search, "i"));
  }
  
  const resumes = await query;
  
  return {
    resumes: resumes.map(resume => ({
      _id: resume._id,
      name: resume.name,
      version: resume.version,
      summary: resume.summary,
      updatedAt: resume.updatedAt
    })),
    count: resumes.length
  };
}

async function getResume(args, userId) {
  const { resumeId } = args;
  
  if (!mongoose.Types.ObjectId.isValid(resumeId)) {
    return { error: "Invalid resume ID" };
  }
  
  const resume = await Resume.findOne({
    _id: resumeId,
    owner: userId
  })
    .populate("experience.company", "name")
    .populate("projects.company", "name")
    .populate("certifications.company", "name");
  
  if (!resume) {
    return { error: "Resume not found" };
  }
  
  return {
    _id: resume._id,
    name: resume.name,
    version: resume.version,
    summary: resume.summary,
    experience: resume.experience || [],
    education: resume.education || [],
    projects: resume.projects || [],
    certifications: resume.certifications || [],
    skills: resume.skills || [],
    notes: resume.notes
  };
}

async function getCoverLetters(args, userId) {
  const { search, limit = 10 } = args || {};
  const maxLimit = Math.min(limit || 10, 50);
  
  const filter = { owner: userId };
  const query = CoverLetter.find(filter)
    .limit(maxLimit)
    .sort({ updatedAt: -1 });
  
  if (search) {
    query.regex("name", new RegExp(search, "i"));
  }
  
  const coverLetters = await query;
  
  return {
    coverLetters: coverLetters.map(cl => ({
      _id: cl._id,
      name: cl.name,
      version: cl.version,
      updatedAt: cl.updatedAt
    })),
    count: coverLetters.length
  };
}

async function getCoverLetter(args, userId) {
  const { coverLetterId } = args;
  
  if (!mongoose.Types.ObjectId.isValid(coverLetterId)) {
    return { error: "Invalid cover letter ID" };
  }
  
  const coverLetter = await CoverLetter.findOne({
    _id: coverLetterId,
    owner: userId
  });
  
  if (!coverLetter) {
    return { error: "Cover letter not found" };
  }
  
  return {
    _id: coverLetter._id,
    name: coverLetter.name,
    version: coverLetter.version,
    body: coverLetter.body,
    notes: coverLetter.notes
  };
}