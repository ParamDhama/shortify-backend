// backend/models/Click.js
const mongoose = require("mongoose");

const ClickSchema = new mongoose.Schema({
    urlId: { type: mongoose.Schema.Types.ObjectId, ref: "Url", required: true },
    ipAddress: { type: String },
    location: { type: String, default: "Unknown" },
    device: { type: String, default: "Unknown" },
    browser: { type: String, default: "Unknown" }
}, { timestamps: true });

module.exports = mongoose.model("Click", ClickSchema);
