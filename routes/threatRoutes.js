/*const express = require("express");
const router = express.Router();
const Threat = require("../models/Threats");

// ✅ GET Threat Data
router.get("/", async (req, res) => {
    try {
        const threats = await Threat.find();
        res.json(threats);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;*/

const express = require("express");
const router = express.Router();
const ThreatModel = require("../models/Threats"); // ✅ Correct Model Import

// ✅ Test route
router.get("/test", (req, res) => {
    res.json({ message: "Threat API is working!" });
});

// ✅ Get all threats
router.get("/", async (req, res) => {
    try {
        const threats = await ThreatModel.find();  // ✅ Correct model usage
        res.json(threats);  // ✅ Return fetched threats
    } catch (error) {
        console.error("Error fetching threats:", error);
        res.status(500).json({ msg: "Server error", error });
    }
});

// ✅ Add a new threat
router.post("/add", async (req, res) => {
    try {
        const { details, ipAddress, severity } = req.body;

        const newThreat = new ThreatModel({  // ✅ Use ThreatModel, not Threat
            details,
            status: "Detected",
            userId: req.body.userId || null,
            ipAddress: ipAddress || req.ip || "Unknown",  // ✅ Correct field name
            severity: severity || "Medium",
            date: new Date()
        });

        await newThreat.save();
        res.status(201).json({ message: "Threat added successfully!", newThreat });
    } catch (error) {
        console.error("❌ Error adding threat:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

