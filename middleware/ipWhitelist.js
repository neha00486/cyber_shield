const WhitelistedIP = require("../models/WhitelistedIP");

module.exports = async (req, res, next) => {
    let clientIP = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;
    // Convert IPv6 localhost to IPv4
    if (clientIP === "::1" || clientIP === "127.0.0.1") {
        clientIP = "127.0.0.1";  
    }

    try {
        const isWhitelisted = await WhitelistedIP.findOne({ ipAddress: clientIP });

        if (!isWhitelisted) {
            console.log(`❌ Access Denied: IP ${clientIP} is not whitelisted.`);
            return res.status(403).json({ msg: "Access denied. Your IP is not whitelisted." });
        }

        console.log(`✅ Access Granted: IP ${clientIP} is whitelisted.`);
        next(); // Proceed to the next middleware
    } catch (error) {
        console.error("❌ Error checking IP whitelist:", error);
        res.status(500).json({ msg: "Server error while checking IP whitelist" });
    }
};


