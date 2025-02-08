const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const { deleteUnverifiedUsers } = require("./utils/deleteUnverifiedUsers");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: process.env.CLIENT_URI })); // Replace with your frontend URL
app.use(bodyParser.json());

// Run cleanup job every hour
setInterval(deleteUnverifiedUsers, 3600000);

// MongoDB Connection
mongoose
  .connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Database connection error:", err));

// ✅ Routes
app.use("/api/auth", require("./routes/authRoutes")); // Authentication & User Management
app.use("/api/admin", require("./routes/adminRoutes")); // Admin Routes
app.use("/api/url", require("./routes/urlRoutes")); // URL Shortening & Management
app.use("/api/clicks", require("./routes/clickRoutes")); // Click Analytics

// Default Route
app.get("/", (req, res) => {
  res.send("Welcome to the URL Shortener API!");
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
