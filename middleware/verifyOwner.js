// Must be run after verifyToken middleware
export const verifyOwner = ({ model, ownerField = "owner" }) => {
  return async (req, res, next) => {
    try {
      // Check if the document exists
      const doc = await model.findById(req.params.id);
      if (!doc) {
        return res.status(404).json({ error: "Not found" });
      }
      // Check if the document is owned by the user
      if (!doc[ownerField].equals(req.user._id)) {
        return res.status(403).json({ error: "Unauthorized" });
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};

// Must be run after verifyToken + validateBody middleware
// Prevents users from revealing information about other users' documents
// by creating applications with documents that are not theirs
// or creating resumes with parents that are not theirs
export const verifyRefOwner = ({
  model,
  refModel,
  refOwnerField = "owner",
  refField = "parent",
}) => {
  const modelName = model.modelName;
  const refModelName = refModel.modelName;
  return async (req, res, next) => {
    try {
      const [docId, refId, userId] = [
        req.params.id,
        req.body[refField],
        req.user._id,
      ];
      if (!refId) {
        return next();
      }
      const [doc, refDoc] = await Promise.all([
        model.findById(docId),
        refModel.findById(refId),
      ]);
      if (!doc) {
        return res
          .status(404)
          .json({ error: `${modelName} ${docId} not found` });
      }
      if (!refDoc) {
        return res
          .status(404)
          .json({ error: `${refModelName} ${refId} not found` });
      }
      if (!refDoc[refOwnerField].equals(userId)) {
        return res.status(403).json({
          error: `Unauthorized: ${refModelName} ${refId} is not owned by the user`,
        });
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};
