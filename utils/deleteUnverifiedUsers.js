const User = require("../models/User")

// 🔹 Function to delete unverified users
const deleteUnverifiedUsers = async () => {
    try {
        const expiryTime = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
        
        // 1️⃣ Find and delete unverified users who registered before expiryTime
        const result = await User.deleteMany({ isVerified: false, createdAt: { $lt: expiryTime } });

        console.log(`✅ Deleted ${result.deletedCount} unverified users.`);
    } catch (error) {
        console.error("❌ Error deleting unverified users:", error);
    }
};

module.exports = {deleteUnverifiedUsers};
