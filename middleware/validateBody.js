/**
 * @param {import("zod").ZodType} schema
 */
export default function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body ?? {});
    if (!result.success) {
      const errors = {};
      for (const issue of result.error.issues) {
        const path = issue.path.length ? issue.path.join(".") : "_root";
        if (!errors[path]) errors[path] = issue.message;
      }
      return res.status(400).json({
        error: "Validation failed",
        errors,
      });
    }
    req.body = result.data;
    next();
  };
}
