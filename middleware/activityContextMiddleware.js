const activityContextMiddleware = (typeConfig) => {
  return (req, res, next) => {
    // typeConfig can be a string or array of strings
    const types = Array.isArray(typeConfig) ? typeConfig : [typeConfig];

    // Set filter for database queries
    req.activityFilter =
      types.length === 1 ? { type: types[0] } : { type: { $in: types } };

    // Set context for views
    res.locals.activityContext = {
      type: types.length === 1 ? types[0] : types,
      displayName: types.length === 1 ? types[0] : types.join("/"),
      pluralName: types.length === 1 ? `${types[0]}s` : types.join("s/") + "s",
      basePath: `/${types.join("-").toLowerCase()}s`,
    };

    next();
  };
};

module.exports = activityContextMiddleware;
