const Click = require("../models/Clicks");
const Url = require("../models/Url");

// ✅ Get Click Data for a Specific URL (User Access)
exports.getUrlClicks = async (req, res) => {
  try {
    const { urlId } = req.params;
    const userId = req.user.id; // Extract user ID from token

    // Check if the user owns the URL
    const url = await Url.findOne({ _id: urlId, userID: userId });
    if (!url) {
      return res.status(403).json({ message: "You do not own this URL." });
    }

    // Fetch all click events for this URL
    const clicks = await Click.find({ urlId });

    res.status(200).json({ totalClicks: clicks.length, clicks });
  } catch (error) {
    console.error("Error fetching URL clicks:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

