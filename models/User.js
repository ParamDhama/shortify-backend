// backend/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // Ensuring unique emails
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    status: { type: String, enum: ["active", "banned"], default: "active" }, // Fixed default value
    isVerified: { type: Boolean, required: true, default: false }, // Fixed casing of "isVerified"
    verificationToken: { type: String },
    verificationTokenExpires: { type: Date },
    resetToken: { type: String },
    resetTokenExpires: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
