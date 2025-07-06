/*const mongoose = require("mongoose");

const ThreatSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    details: String,
    status: String,
    userId: mongoose.Schema.Types.ObjectId,
    ipAddress: String,
    severity: String,
});

module.exports = mongoose.model("Threat", ThreatSchema);*/


/*const mongoose = require("mongoose");

const ThreatSchema = new mongoose.Schema({
    username: { type: String, required: true }, // ✅ Store username
    ipAddress: { type: String, required: true }, // ✅ Store IP Address
    date: { type: Date, default: Date.now }, // ✅ Timestamp
    details: { type: String, default: "Login Attempt" }, // ✅ Optional details
    status: { type: String, enum: ["Successful", "Failed"], default: "Successful" }, // ✅ Status of attempt
    severity: { type: String, enum: ["Low", "Medium", "High"], default: "Low" } // ✅ Severity level
});

module.exports = mongoose.model("Threat", ThreatSchema);*/

const mongoose = require("mongoose");

const ThreatSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    details: String,
    status: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    username: { type: String, default: "Unknown" }, // Ensure username has a default value
    ipAddress: String,
    severity: String
});

module.exports = mongoose.model("Threat", ThreatSchema);

