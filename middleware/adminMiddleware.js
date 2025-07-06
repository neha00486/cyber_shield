const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ msg: "No token provided, access denied" });
        }

        const token = authHeader.split(" ")[1]; // Extract token
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decode token

        req.user = decoded; // Attach user data to request
        
        if (req.user.role !== "admin") {
            return res.status(403).json({ msg: "Access denied, admin only" });
        }

        next(); // Proceed to the next middleware
    } catch (error) {
        res.status(401).json({ msg: "Invalid token" });
    }
};
