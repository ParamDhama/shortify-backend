// backend/models/Url.js
const mongoose = require('mongoose');

const UrlSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Use ObjectId to reference User model
  originalUrl: { type: String, required: true },
  slug: { type: String, required: true, unique: true }, // Added unique constraint
  qrCode: { type: String },   // Store base64 QR code
  clicks: { type: Number, default: 0 },
  expire_at: { type: Date },
  isDeleted : {type: Boolean, default : false}
}, { timestamps: true });

module.exports = mongoose.model('Url', UrlSchema);
