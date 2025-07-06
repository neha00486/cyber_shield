const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "engineer", "analyst", "it_support", "employee"], default: "employee" },
    ipAddress: { type: String, default: "Unknown" },  // ✅ Store IP Address
    status: { type: String, default: "Active" }
});

module.exports = mongoose.model("User", UserSchema);


