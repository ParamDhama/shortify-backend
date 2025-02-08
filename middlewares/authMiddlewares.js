const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = (requiredRoles = []) => {
  return async (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

    try {
      const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
      req.user = decoded;

      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      if (requiredRoles.length && !requiredRoles.includes(user.role)) {
        return res.status(403).json({ message: "Forbidden! You do not have access." });
      }

      next();
    } catch (error) {
      res.status(400).json({ message: "Invalid token" });
    }
  };
};

module.exports = authMiddleware;
