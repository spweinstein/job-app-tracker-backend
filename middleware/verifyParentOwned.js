import Resume from "../models/resumeModel.js";
import CoverLetter from "../models/coverLetterModel.js";

/**
 * After validateBody: if `req.body.parent` is set, ensures the referenced document
 * exists and `owner` matches `req.user` (Resume and CoverLetter use the Document base schema).
 * Normalizes `req.body.parent` to the document `_id` and sets `req.verifiedParent` for handlers.
 *
 * If `parent` is omitted or empty, calls `next()` without querying (root document).
 *
 * @param {import("mongoose").Model} Model - `Resume` or `CoverLetter`
 * @param {object} [options]
 * @param {string} [options.resourceLabel] - Used in error messages (defaults to `Model.modelName`)
 * @returns {import("express").RequestHandler}
 */
export function verifyParentOwned(Model, options = {}) {
  const resourceLabel = options.resourceLabel ?? Model.modelName;

  return async function verifyParentOwnedMiddleware(req, res, next) {
    try {
      const parentId = req.body.parent;
      if (parentId == null || parentId === "") {
        return next();
      }

      const parent = await Model.findById(parentId);
      if (!parent) {
        return res
          .status(404)
          .json({ error: `Parent ${resourceLabel} not found` });
      }
      if (!parent.owner.equals(req.user._id)) {
        return res.status(403).json({
          error: `You are not authorized to use this ${resourceLabel} as a parent document`,
        });
      }

      req.body.parent = parent._id;
      req.verifiedParent = parent;
      next();
    } catch (err) {
      next(err);
    }
  };
}

/** Pre-bound middleware for POST/PUT `/resumes` when `body.parent` may be set. */
export const verifyResumeParentOwned = verifyParentOwned(Resume, {
  resourceLabel: "resume",
});

/** Pre-bound middleware for POST/PUT `/coverLetters` when `body.parent` may be set. */
export const verifyCoverLetterParentOwned = verifyParentOwned(CoverLetter, {
  resourceLabel: "cover letter",
});
