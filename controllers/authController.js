const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const SecurityLog = require("../models/SecurityLog");
const ThreatModel = require("../models/Threats");
const BlockedIP = require("../models/BlockedIP");
require("dotenv").config();

// ✅ Function to Log Threat Events
const logThreatEvent = async (details, status, userId, username, ipAddress, severity) => {
    await ThreatModel.create({
        date: new Date(),
        details,
        status,
        userId: userId || null,
        username: username || "Unknown",
        ipAddress,
        severity
    });
};

// ✅ IP Failure Tracking (Stores failed attempts)
const failedLoginAttempts = {}; // Temporary storage (Resets on server restart)
const MAX_FAILED_ATTEMPTS = 5; // Block after 5 failed attempts

// ✅ Login Function with IP Blocking
const loginUser = async (req, res) => {
    try {
        const { email, password, ipAddress } = req.body; // ✅ Get IP from frontend
        let clientIP = ipAddress || req.headers["x-forwarded-for"] || req.ip || req.socket.remoteAddress;
        if (clientIP === "::1") clientIP = "127.0.0.1"; // ✅ Normalize localhost IP

        // ✅ Check if IP is blocked
        const isBlocked = await BlockedIP.findOne({ ipAddress: clientIP });
        if (isBlocked) {
            return res.status(403).json({ msg: "Access denied. Your IP is blocked." });
        }

        const user = await User.findOne({ email });
        if (!user) {
            await logThreatEvent("Unknown email used for login.", "Failed", null, "Unknown", clientIP, "Medium");

            // ✅ Track failed login attempts
            failedLoginAttempts[clientIP] = (failedLoginAttempts[clientIP] || 0) + 1;
            if (failedLoginAttempts[clientIP] >= MAX_FAILED_ATTEMPTS) {
                await BlockedIP.create({ ipAddress: clientIP }); // ✅ Block IP after too many attempts
                return res.status(403).json({ msg: "Too many failed attempts. Your IP has been blocked." });
            }

            return res.status(400).json({ msg: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            await logThreatEvent(`Failed password attempt for ${user.username}.`, "Failed", user._id, user.username, clientIP, "Medium");

            failedLoginAttempts[clientIP] = (failedLoginAttempts[clientIP] || 0) + 1;
            if (failedLoginAttempts[clientIP] >= MAX_FAILED_ATTEMPTS) {
                await BlockedIP.create({ ipAddress: clientIP });
                return res.status(403).json({ msg: "Too many failed attempts. Your IP has been blocked." });
            }

            return res.status(400).json({ msg: "Invalid credentials" });
        }

        // ✅ Reset failed attempts on successful login
        failedLoginAttempts[clientIP] = 0;

        // ✅ Log Successful Login
        await logThreatEvent(`User ${user.username} logged in successfully.`, "Successful", user._id, user.username, clientIP, "Low");

        // ✅ Generate JWT Token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ msg: "Login successful", token, role: user.role, ipAddress: clientIP });
    } catch (error) {
        console.error("❌ Login Error:", error);
        res.status(500).json({ msg: "Server error" });
    }
};

// ✅ Register User Function
const registerUser = async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ username, email, password: hashedPassword, role });

        await user.save();
        res.status(201).json({ msg: "User registered successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
};

// ✅ Export updated functions
module.exports = { registerUser, loginUser };