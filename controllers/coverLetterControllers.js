import CoverLetter from "../models/coverLetterModel.js";
import Application from "../models/applicationModel.js";

// GET "/coverLetters/"
const getCoverLetters = async (req, res) => {
  try {
    const result = await CoverLetter.paginate(req, { owner: req.user._id }, {
      populate: ["parent"],
    });
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// GET "/coverLetters/:id"
const getCoverLetter = async (req, res) => {
  try {
    const coverLetter = await CoverLetter.findOne({
      owner: req.user._id,
      _id: req.params.id,
    })
      .populate("parent")
      .populate("children");
    res.json(coverLetter);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
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

// POST "/coverLetters/"
const createCoverLetter = async (req, res) => {
  try {
    req.body.owner = req.user._id;

    // Remove root from req.body (it's derived, not user-set)
    delete req.body.root;
    req.body.version = await computeVersion(CoverLetter, req.body.parent);

    // Set root based on parent
    if (req.body.parent && req.body.parent !== "") {
      const parent = await CoverLetter.findById(req.body.parent);
      if (parent) {
        req.body.root = parent.root || parent._id;
      }
    } else {
      req.body.parent = null;
      req.body.root = null;
    }

    const coverLetter = await CoverLetter.create(req.body);
    res.status(201).json(coverLetter);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// DELETE "/coverLetters/:id"
const deleteCoverLetter = async (req, res) => {
  try {
    const jobAppCount = await Application.countDocuments({
      coverLetter: req.params.id,
    });

    if (jobAppCount > 0) {
      return res.status(400).json({
        error: `Cannot delete cover letter. It has ${jobAppCount} linked job application(s). Please delete those first.`,
      });
    }

    await CoverLetter.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// PUT "/coverLetters/:id"
const updateCoverLetter = async (req, res) => {
  try {
    // Check if another coverLetter with this name exists (excluding current coverLetter)
    const duplicateCoverLetter = await CoverLetter.findOne({
      owner: req.user._id,
      name: req.body.name,
      _id: { $ne: req.params.id }, // Exclude the current coverLetter being updated
    });

    if (duplicateCoverLetter) {
      return res
        .status(409)
        .json({ error: `CoverLetter ${req.body.name} already in database!` });
    } else {
      const coverLetter = await CoverLetter.findOneAndUpdate(
        {
          owner: req.user._id,
          _id: req.params.id,
        },
        req.body,
        { new: true },
      );
      res.json(coverLetter);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export {
  getCoverLetters,
  getCoverLetter,
  createCoverLetter,
  deleteCoverLetter,
  updateCoverLetter,
};
