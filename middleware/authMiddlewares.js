const passUserToView = (req, res, next) => {
  res.locals.user = req.session.user ? req.session.user : null;
  next();
};

const isSignedIn = (req, res, next) => {
  if (req.session.user) return next();
  res.redirect("/auth/login");
};

module.exports = { passUserToView, isSignedIn };
