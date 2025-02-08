const express = require("express");
const router = express.Router();
const clickController = require("../controllers/clickController");
const authMiddleware = require("../middlewares/authMiddleware");

// ✅ Get Click Data for a Specific URL (Requires Authentication)
router.get("/clicks/:urlId", authMiddleware(), clickController.getUrlClicks);

module.exports = router;
