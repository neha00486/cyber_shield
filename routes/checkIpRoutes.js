const express = require("express");
const router = express.Router();

router.get("/check-ip", (req, res) => {
    let clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    // ✅ Convert "::1" (IPv6 localhost) to "127.0.0.1" (IPv4 localhost)
    if (clientIP === "::1") {
        clientIP = "127.0.0.1";
    }

    console.log("Client IP Address:", clientIP); // Debugging

    res.json({ yourIP: clientIP });
});

module.exports = router;
