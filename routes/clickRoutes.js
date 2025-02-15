const express = require("express");
const router = express.Router();
const clickController = require("../controllers/clickController");
const authMiddleware = require("../middlewares/authMiddlewares");

// ✅ Get Click Data for a Specific URL (Requires Authentication)
router.get("/:urlId", authMiddleware(), clickController.getUrlClicks);

module.exports = router;
