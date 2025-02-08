const express = require("express");
const router = express.Router();
const urlController = require("../controllers/urlController");
const authMiddleware = require("../middlewares/authMiddleware");

// ✅ Create a Short URL (Requires Authentication)
router.post("/shorten", authMiddleware(), urlController.createShortUrl);

// ✅ Redirect to Original URL and Track Clicks
router.get("/:shortUrl", urlController.redirectToOriginalUrl);

// ✅ Get All URLs Created by the Authenticated User
router.get("/user/urls", authMiddleware(), urlController.getUserUrls);

// ✅ Delete a Short URL (Soft Delete)
router.delete("/user/urls/:shortUrl", authMiddleware(), urlController.deleteUserUrl);

module.exports = router;
