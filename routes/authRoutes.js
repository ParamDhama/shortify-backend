const express = require("express");
const {
    handleCreateUser,
    handleForgetPassword,
    handleResetPassword,
    handleLogin,
    handleResendVerification,
    handleVerification,
    handleChangePassword
} = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddlewares");

const router = express.Router();

// User Authentication Routes
router.post("/register", handleCreateUser);
router.post("/login", handleLogin);
router.post("/forgot-password", handleForgetPassword);
router.post("/reset-password/:token", handleResetPassword);
router.post("/resend-verification", handleResendVerification);
router.get("/verify/:token", handleVerification);
router.post("/change-password", authMiddleware(), handleChangePassword);

module.exports = router;
