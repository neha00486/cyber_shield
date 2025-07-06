const User = require("../models/User");
const WhitelistedIP = require("../models/WhitelistedIP");
const SecurityLog = require("../models/SecurityLog");

// ✅ Get Users for Access Control (Only Whitelisted IPs)
exports.getUsersForAccessControl = async (req, res) => {
    try {
        const whitelistedIPs = await WhitelistedIP.find({}, "ipAddress");
        const ipList = whitelistedIPs.map(ip => ip.ipAddress);

        const users = await User.find({ ipAddress: { $in: ipList } }, "username role ipAddress status");
        res.json(users);
    } catch (error) {
        console.error("❌ Error fetching access control data:", error);
        res.status(500).json({ msg: "Server Error" });
    }
};

// ✅ Get All Users (For Manage Users & Access Control)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, "username email role ipAddress status");
        res.json(users);
    } catch (error) {
        console.error("❌ Error fetching all users:", error);
        res.status(500).json({ msg: "Server error" });
    }
};

// ✅ Update User Role (Admin Only)
exports.updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select("-password");
        if (!user) return res.status(404).json({ msg: "User not found" });

        res.json({ msg: "User role updated successfully", user });
    } catch (error) {
        console.error("❌ Error updating user role:", error);
        res.status(500).json({ msg: "Server error" });
    }
};

// ✅ Delete User
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByIdAndDelete(id);
        if (!user) return res.status(404).json({ msg: "User not found" });

        res.json({ msg: "User deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting user:", error);
        res.status(500).json({ msg: "Server error" });
    }
};

// ✅ Lock a User Account
exports.lockUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { status: "Locked" }, { new: true });
        if (!user) return res.status(404).json({ msg: "User not found" });

        res.json({ msg: "User locked successfully!", user });
    } catch (error) {
        console.error("❌ Error locking user:", error);
        res.status(500).json({ msg: "Server error" });
    }
};

// ✅ Unlock a User Account
exports.unlockUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { status: "Active" }, { new: true });
        if (!user) return res.status(404).json({ msg: "User not found" });

        res.json({ msg: "User unlocked successfully!", user });
    } catch (error) {
        console.error("❌ Error unlocking user:", error);
        res.status(500).json({ msg: "Server error" });
    }
};

// ✅ Add IP to Whitelist (Admin Only)
exports.whitelistIP = async (req, res) => {
    const { ipAddress } = req.body;

    try {
        if (!ipAddress) return res.status(400).json({ msg: "IP Address is required" });

        const existingIP = await WhitelistedIP.findOne({ ipAddress });
        if (existingIP) return res.status(400).json({ msg: "IP already whitelisted" });

        const newIP = new WhitelistedIP({ ipAddress });
        await newIP.save();

        res.json({ msg: "IP added to whitelist", newIP });
    } catch (error) {
        console.error("❌ Error whitelisting IP:", error);
        res.status(500).json({ msg: "Server error" });
    }
};

// ✅ Remove IP from Whitelist (Admin Only)
exports.removeIP = async (req, res) => {
    try {
        const { ip } = req.params;
        const removedIP = await WhitelistedIP.findOneAndDelete({ ipAddress: ip });

        if (!removedIP) return res.status(404).json({ msg: "IP not found in whitelist" });

        res.json({ msg: "IP removed from whitelist" });
    } catch (error) {
        console.error("❌ Error removing IP from whitelist:", error);
        res.status(500).json({ msg: "Server error" });
    }
};

// ✅ Fetch Threat Analytics Logs
exports.getThreatAnalytics = async (req, res) => {
    try {
        const logs = await SecurityLog.find({}, "eventType ipAddress severity timestamp").sort({ timestamp: -1 });
        res.json(logs);
    } catch (error) {
        console.error("❌ Error fetching threat analytics:", error);
        res.status(500).json({ msg: "Server error" });
    }
};
