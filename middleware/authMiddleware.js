const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Verify Token Middleware

const verifyToken = (req, res, next) => {
    const authHeader = req.header("Authorization");
    console.log("🛠 Received Auth Header:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.error("❌ No token found or format incorrect");
        return res.status(401).json({ msg: "No token, authorization denied" });
    }

    const token = authHeader.split(" ")[1];
    console.log("🔍 Extracted Token:", token);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ Decoded User:", decoded);

        if (!decoded || !decoded.id) {
            console.error("❌ Token decoded, but no user ID found:", decoded);
            return res.status(401).json({ msg: "Invalid token payload" });
        }

        req.user = decoded;  // Attach user info to request
        next();
    } catch (error) {
        console.error("❌ Token Verification Error:", error.message);
        return res.status(401).json({ msg: "Invalid token" });
    }
};


// Verify Admin Middleware
const verifyAdmin = async (req, res, next) => {
    console.log("🔍 Checking Admin Access - User:", req.user); // Debugging log

    if (!req.user || !req.user.id) {
        console.error("❌ Unauthorized: No user object found in request");
        return res.status(403).json({ msg: "Unauthorized: No user data in request" });
    }

    try {
        const user = await User.findById(req.user.id);
        console.log("✅ Found User:", user); // Debugging log

        if (!user || user.role !== "admin") {
            console.error("❌ Access Denied: User is not an admin");
            return res.status(403).json({ msg: "Access denied, admin only" });
        }

        next();
    } catch (error) {
        console.error("❌ Server Error:", error);
        res.status(500).json({ msg: "Server Error" });
    }
};


const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;  // Extract Authorization header

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ msg: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];  // Extract token

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Verify token
        req.user = decoded;  // Attach user data to request
        next();  // Proceed to next middleware
    } catch (error) {
        return res.status(401).json({ msg: "Unauthorized: Invalid token" });
    }
};
module.exports = { verifyToken, verifyAdmin, authMiddleware };


