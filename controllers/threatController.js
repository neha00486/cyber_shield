/*const getThreats = async (req, res) => {
    try {
        // Simulated threat data
        const threats = [
            { type: "Phishing", severity: "High", detectedAt: new Date() },
            { type: "DDoS", severity: "Critical", detectedAt: new Date() },
            { type: "Malware", severity: "Medium", detectedAt: new Date() },
        ];
        res.json(threats);
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
};

module.exports = { getThreats };*/

const Threat = require("../models/Threats"); // ✅ Ensure correct model import

// ✅ Controller to get daily threats
const getThreats = async (req, res) => {
    try {
        const threats = await Threat.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }, // ✅ Groups by date
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } },
        ]);

        console.log("Fetched Threats:", threats); // ✅ Debugging log
        res.json(threats);
    } catch (error) {
        console.error("❌ Error fetching threats:", error);
        res.status(500).json({ error: "Internal Server Error" }); // ✅ Fixed typo in `json`
    }
};

// ✅ Controller to log threats
const logThreat = async (req, res) => {
    try {
        let clientIP = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;
        if (clientIP === "::1") clientIP = "127.0.0.1"; // ✅ Normalize localhost

        // ✅ Store IP and threat details
        const newThreat = new Threat({
            username: req.body.username || "Unknown",
            ipAddress: clientIP,
            severity: "high", // Change severity logic as needed
            actionTaken: "Blocked",
            date: new Date()
        });

        await newThreat.save();
        console.log(`🔹 Threat logged for IP: ${clientIP}`);

        res.status(201).json({ msg: "Threat logged successfully", threat: newThreat });
    } catch (error) {
        console.error("❌ Error logging threat:", error);
        res.status(500).json({ error: "Server error while logging threat" });
    }
};

module.exports = { getThreats, logThreat };
