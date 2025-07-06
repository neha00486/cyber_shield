const express = require("express"); 
const router = express.Router();
const adminController = require("../controllers/adminController");
const adminMiddleware = require("../middleware/adminMiddleware");
const BlockedIP = require("../models/BlockedIP");


// ✅ User Management Routes
router.get("/all-users", adminMiddleware, adminController.getAllUsers);
router.put("/update-role/:id", adminMiddleware, adminController.updateUserRole);
router.delete("/delete-user/:id", adminMiddleware, adminController.deleteUser);

// ✅ Access Control Routes
router.get("/access-control", adminMiddleware, adminController.getUsersForAccessControl);

// ✅ Lock/Unlock User Routes
router.put("/lock-user/:id", adminMiddleware, adminController.lockUser);
router.put("/unlock-user/:id", adminMiddleware, adminController.unlockUser);

// ✅ Threat Analytics Route
router.get("/threat-analytics", adminMiddleware, adminController.getThreatAnalytics);

// ✅ Unblock an IP (Admin Only)
router.delete("/unblock-ip/:ip", async (req, res) => {
    try {
        const { ip } = req.params;
        await BlockedIP.deleteOne({ ipAddress: ip });
        res.json({ msg: `IP ${ip} has been unblocked.` });
    } catch (error) {
        console.error("Error unblocking IP:", error);
        res.status(500).json({ msg: "Server error" });
    }
});
module.exports = router;

