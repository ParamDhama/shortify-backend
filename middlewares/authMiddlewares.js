const jwt = require("jsonwebtoken");

const authMiddleware = (requiredRoles = []) => {
  return (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
      const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
      req.user = decoded; // Already contains id & role, no need to fetch user

      if (requiredRoles.length && !requiredRoles.includes(req.user.role)) {
        return res.status(403).json({ message: "Forbidden! You do not have access." });
      }

      next();
    } catch (error) {
      res.status(400).json({ message: "Invalid token" });
    }
  };
};

module.exports = authMiddleware;
