const User = require("../models/User");

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
};

const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        await User.findByIdAndUpdate(req.params.id, { role });
        res.json({ msg: "User role updated successfully" });
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
};

const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ msg: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
};

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    role: String,
    ipHistory: { type: [String], default: [] }  // ✅ Store previous IPs
});

module.exports = mongoose.model("User", UserSchema);


module.exports = { getAllUsers, updateUserRole, deleteUser };

