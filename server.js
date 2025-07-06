require("dotenv").config(); // Load environment variables
console.log("✅ JWT_SECRET Loaded:", process.env.JWT_SECRET ? "Yes" : "No");
console.log("✅ MONGO_URI Loaded:", process.env.MONGO_URI ? "Yes" : "No");
const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const cors = require("cors");

const app = express();
app.use((req, res, next) => {
    console.log("🛠 Incoming Request Headers:", req.headers);
    next();
});
app.set("trust proxy", true);
app.use(express.json());
app.use(cors());

// ✅ Serve static files
app.use(express.static("public"));

// ✅ Import Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const threatRoutes = require("./routes/threatRoutes"); // ✅ Import Threat Routes

// ✅ Connect to MongoDB
connectDB();

// ✅ Apply Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/threats", threatRoutes); // ✅ Register the route




// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

