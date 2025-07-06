/*const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware"); // ✅ Ensure correct path
const User = require("../models/User"); // ✅ Import User model

// ✅ Fix: Ensure `authMiddleware` is a function before using it
if (typeof authMiddleware !== "function") {
    console.error("❌ Error: authMiddleware is not a function");
    process.exit(1);
}

// ✅ GET Profile Route (Protected)
router.get("/profile", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server Error" });
    }
});

module.exports = router;*/

const express = require("express");
const router = express.Router();
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware"); // ✅ Import middleware functions
const User = require("../models/User"); // ✅ Import User model

// ✅ GET Profile Route (Protected - User must be authenticated)
router.get("/profile", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ msg: "Server Error" });
    }
});

// ✅ GET All Users (Protected - Admin only)
router.get("/", verifyToken, verifyAdmin, async (req, res) => {
    try {
        const users = await User.find({}, "-password"); // Exclude passwords
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ msg: "Server error" });
    }
});

// ✅ DELETE User (Protected - Admin only)
router.delete("/:id", verifyToken, verifyAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        await user.deleteOne();
        res.json({ msg: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ msg: "Server error" });
    }
});

// ✅ Fix: Fetch all users & return required fields
router.get("/access-control", verifyAdmin, async (req, res) => {
    try {
        console.log("📌 Fetching users from database...");

        const users = await User.find({}, "username role ipAddress status");
        console.log("📌 Users found:", users);  // Debugging log

        if (!users.length) {
            console.warn("⚠️ No users found in the database.");
            return res.status(404).json({ msg: "No users found" });
        }

        res.json(users);
    } catch (error) {
        console.error("❌ Error fetching access control data:", error);
        res.status(500).json({ msg: "Server Error" });
    }
});

module.exports = router;





