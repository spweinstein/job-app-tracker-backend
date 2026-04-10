import jwt from "jsonwebtoken";

function verifyToken(req, res, next) {
  try {
    const authorization = req.headers?.authorization;
    if(!authorization) {
      return res.status(401).json({ error: "Unauthorized." });
    }
    const token = authorization.split(" ")[1];
    if(!token) {
      return res.status(401).json({ error: "Unauthorized." });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded.payload;

    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token." });
  }
}

export default verifyToken;
