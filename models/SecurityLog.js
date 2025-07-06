const mongoose = require("mongoose");

const SecurityLogSchema = new mongoose.Schema({
    eventType: { type: String, required: true },  // "Successful Login" / "Failed Login Attempt"
    ipAddress: { type: String, required: true },  // Stores the user's IP
    severity: { type: String, required: true },   // "Low", "Medium", "High"
    timestamp: { type: Date, default: Date.now }  // Auto-generated timestamp
});

module.exports = mongoose.model("SecurityLog", SecurityLogSchema);
