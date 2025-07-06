const mongoose = require("mongoose");

const WhitelistedIPSchema = new mongoose.Schema({
    ipAddress: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    trustScore: { type: Number, default: 1 },
    status: { type: String, enum: ["pending", "approved", "blocked"], default: "pending" },
    addedAt: { type: Date, default: Date.now },
    lastSeen: { type: Date, default: Date.now }
});

module.exports = mongoose.model("WhitelistedIP", WhitelistedIPSchema);

/*onst mongoose = require('mongoose');

const whitelistedIPSchema = new mongoose.Schema({
    ip: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const WhitelistedIP = mongoose.model('WhitelistedIP', whitelistedIPSchema);

// Insert a dummy IP into the database for testing
async function addDummyIP() {
    const newIP = new WhitelistedIP({ ip: generateDummyIP() });
    await newIP.save();
    console.log("Dummy IP added:", newIP);
}

addDummyIP();*/
