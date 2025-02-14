const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authMiddleware = require("../middlewares/authMiddlewares");

// Middleware to restrict access to admins only
const adminOnly = authMiddleware(["admin"]);

// ✅ Get All Users (Admin)
router.get("/users", adminOnly, adminController.handleGetUsers);

// ✅ Change User Role (Admin)
router.put("/users/role", adminOnly, adminController.handleUserRole);

// ✅ Ban/Unban User (Admin)
router.put("/users/ban/:id", adminOnly, adminController.handleUserBan);

// ✅ Delete User (Admin)
router.delete("/users/:id", adminOnly, adminController.handleUserDelete);

// ✅ Restore Deleted URL (Admin)
router.put("/urls/restore", adminOnly, adminController.handleRestoreUrl);

// ✅ Delete URL (Admin)
router.delete("/urls", adminOnly, adminController.handleUrlDelete);

// ✅ Get All Click Analytics (Admin)
router.get("/clicks", adminOnly, adminController.handleGetAllClicks);

module.exports = router;
