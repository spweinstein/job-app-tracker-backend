import Resume from "../models/resumeModel.js";
import Company from "../models/companyModel.js";
import Application from "../models/applicationModel.js";

// controllers/resumes.js
const getResumes = async (req, res) => {
  try {
    const result = await Resume.paginate(
      req,
      { owner: req.user._id },
      {
        populate: ["parent"],
      },
    );
    return res.json(result);
  } catch (e) {
    console.log(`Error at getResumes: ${e}`);
    res.status(500).json({ error: e.message });
  }
};

/**
 * Computes the version string for a new document being created.
 * @param {mongoose.Model} Model - The model to query (Resume or CoverLetter)
 * @param {string|null} parentId - The parent document's _id, or null/undefined
 * @returns {Promise<string>} e.g. "0", "1", "2.3", "1.2.1"
 */
export async function computeVersion(Model, parentId) {
  if (!parentId) return "0";

  const parent = await Model.findById(parentId).select("version");
  if (!parent) return "0";

  const siblingCount = await Model.countDocuments({ parent: parentId });
  const newIndex = siblingCount + 1;

  // Parent is a root doc ("0") — drop the "0." prefix
  if (parent.version === "0" || parent.version === 0) {
    return String(newIndex);
  }

  return `${parent.version}.${newIndex}`;
}

const createResume = async (req, res) => {
  try {
    req.body.owner = req.user._id;

    // Remove root from req.body (it's derived, not user-set)
    delete req.body.root;
    req.body.version = await computeVersion(Resume, req.body.parent);

    // Set root based on parent
    if (req.body.parent && req.body.parent !== "") {
      const parent = await Resume.findById(req.body.parent);
      if (parent) {
        req.body.root = parent.root || parent._id;
      }
    } else {
      req.body.parent = null;
      req.body.root = null;
    }

    // Clean up empty company references in projects
    if (req.body.projects) {
      req.body.projects.forEach((proj) => {
        if (proj.company === "" || !proj.company) {
          delete proj.company;
        }
      });
    }

    // Clean up empty company references in certifications
    if (req.body.certifications) {
      req.body.certifications.forEach((cert) => {
        if (cert.company === "" || !cert.company) {
          delete cert.company;
        }
      });
    }
    // console.log(req.body);
    const resume = await Resume.create(req.body);
    res.status(201).json(resume);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const updateResume = async (req, res) => {
  try {
    // Ensure that if we are updating the resume and emptying one of these optional sections,
    // that the optional section is cleared from the db record
    req.body.education = req.body.education ? req.body.education : [];
    req.body.projects = req.body.projects ? req.body.projects : [];
    req.body.certifications = req.body.certifications
      ? req.body.certifications
      : [];

    // Clean up empty company references
    if (req.body.projects) {
      req.body.projects.forEach((proj) => {
        if (proj.company === "") {
          delete proj.company;
        }
      });
    }

    if (req.body.certifications) {
      req.body.certifications.forEach((cert) => {
        if (cert.company === "") {
          delete cert.company;
        }
      });
    }

    const resume = await Resume.findOneAndUpdate(
      {
        owner: req.user._id,
        _id: req.params.id,
      },
      req.body,
      { new: true },
    );
    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }
    res.json(resume);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      owner: req.user._id,
      _id: req.params.id,
    })
      .populate("experience.company")
      .populate("projects.company")
      .populate("certifications.company")
      .populate("parent")
      .populate("children");

    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }
    res.json(resume);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const deleteResume = async (req, res) => {
  try {
    const [jobAppCount, childCount] = await Promise.all([
      Application.countDocuments({ resume: req.params.id }),
      Resume.countDocuments({ parent: req.params.id }),
    ]);
    if (jobAppCount > 0) {
      return res.status(400).json({
        error: `Cannot delete resume. It has ${jobAppCount} linked job application(s). Please delete those first.`,
      });
    }

    if (childCount > 0) {
      return res.status(400).json({
        error: `Cannot delete resume. It has ${childCount} forked version(s). Please delete those first.`,
      });
    }

    const deletedResume = await Resume.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!deletedResume)
      return res.status(404).json({ error: "Can't find resume to delete" });
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export { getResumes, createResume, updateResume, getResume, deleteResume };
