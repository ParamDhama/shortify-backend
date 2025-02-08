const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendEmail = require("../utils/nodemailer");

// ✅ Helper Function: Validate Password Strength
const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};

// ✅ Helper Function: Generate Random String
const createRandomString = (length) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

// ✅ User Registration
const handleCreateUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) return res.status(400).json({ error: "Invalid Credentials" });

        if (!isValidPassword(password)) {
            return res.status(400).json({
                message: "Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character."
            });
        }

        if (await User.findOne({ email })) return res.status(400).json({ message: "Email already in use" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const verificationToken = createRandomString(6);
        const verificationTokenExpires = Date.now() + 30 * 60 * 1000; // Expires in 30 minutes

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            verificationToken,
            verificationTokenExpires
        });

        await newUser.save();

        const verificationLink = `${process.env.BASE_URL}/api/users/verify/${verificationToken}`;
        await sendEmail(email, "Verify Your Email",
            `<h3>Click the link below to verify your email:</h3>
         <a href="${verificationLink}">${verificationLink}</a>`
        );

        res.status(201).json({ message: "User registered! Check your email to verify your account." });

    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ✅ Email Verification
const handleVerification = async (req, res) => {
    try {
        const user = await User.findOne({ verificationToken: req.params.token });

        if (!user) return res.status(400).json({ message: "Invalid or expired verification token" });

        if (user.verificationTokenExpires < Date.now()) {
            return res.status(400).json({ message: "Verification token expired. Request a new one." });
        }

        user.isVerified = true;
        user.verificationToken = null;
        user.verificationTokenExpires = null;

        await user.save();

        res.json({ message: "Email verified successfully! You can now log in." });

    } catch (err) {
        console.log("Error: ", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ✅ Resend Verification Email
const handleResendVerification = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        if (user.isVerified) return res.status(400).json({ message: "User is already verified" });

        const newVerificationToken = createRandomString(6);
        user.verificationToken = newVerificationToken;
        user.verificationTokenExpires = Date.now() + 30 * 60 * 1000; // 30 minutes expiry

        await user.save();

        const verificationLink = `${process.env.BASE_URL}/api/users/verify/${newVerificationToken}`;
        await sendEmail(email, "Verify Your Email",
            `<h3>Click the link below to verify your email:</h3>
         <a href="${verificationLink}">${verificationLink}</a>`
        );

        res.json({ message: "Verification email sent. Check your inbox." });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ✅ User Login
const handleLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) return res.status(400).json({ message: "Bad Request" });

        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: "Invalid email or password" });

        if (!user.isVerified) return res.status(403).json({ message: "Please verify your email before login" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ message: "Login Successful", token });

    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ✅ Forgot Password (Generate Reset Token)
const handleForgetPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        const resetToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

        user.resetToken = hashedToken;
        user.resetTokenExpires = Date.now() + 3600000; // 1 hour expiry

        await user.save();

        const resetLink = `${process.env.CLIENT_URL}/users/reset-password/${resetToken}`;
        await sendEmail(email, "Reset Your Password",
            `<h3>Click the link below to reset your password:</h3>
         <a href="${resetLink}">${resetLink}</a>`
        );

        res.json({ message: "Password reset email sent. Check your inbox." });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ✅ Reset Password (Set New Password)
const handleResetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        if (!isValidPassword(newPassword)) {
            return res.status(400).json({
                message: "Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character."
            });
        }

        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const user = await User.findOne({
            resetToken: hashedToken,
            resetTokenExpires: { $gt: Date.now() }
        });

        if (!user) return res.status(400).json({ message: "Invalid or expired reset token" });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.resetToken = null;
        user.resetTokenExpires = null;

        await user.save();

        res.json({ message: "Password reset successfully! You can now log in." });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const handleChangePassword = async (req, res) => {
    try {
        const userId = req.user.id; // Extract user ID from token
        const { oldPassword, newPassword } = req.body;

        // Check if new password meets security requirements
        if (!isValidPassword(newPassword)) {
            return res.status(400).json({
                message: "Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character."
            });
        }

        // Find user in the database
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Compare old password
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: "Old password is incorrect" });

        // Hash new password and save
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({ message: "Password changed successfully!" });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    handleCreateUser,
    handleForgetPassword,
    handleResetPassword,
    handleLogin,
    handleResendVerification,
    handleVerification,
    handleChangePassword,
};
