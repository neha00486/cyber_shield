const mongoose = require("mongoose");

const BlockedIPSchema = new mongoose.Schema({
    ipAddress: { type: String, required: true, unique: true },
    blockedAt: { type: Date, default: Date.now },
    reason: { type: String, default: "Multiple failed login attempts" }
});

module.exports = mongoose.model("BlockedIP", BlockedIPSchema);
