// src/routes/dealRoutes.js
import express from "express";
import jwt from "jsonwebtoken";
import Deal from "../models/Deal.js";
import User from "../models/User.js";

const router = express.Router();

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided." });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: "Invalid token." });
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    });
};

// Create new deal
router.post("/", verifyToken, async (req, res) => {
    const dealData = req.body;
    try {
        const deal = new Deal({ ...dealData, createdBy: req.userId });
        await deal.save();
        res.status(201).json({ message: "Deal registered successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong." });
    }
});

// Get all deals (admin only)
router.get("/", verifyToken, async (req, res) => {
    try {
        if (req.userRole !== "admin") {
            return res.status(403).json({ message: "Access denied." });
        }
        const deals = await Deal.find().populate("createdBy", "name email");
        res.json(deals);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong." });
    }
});

// Get single deal by ID
router.get("/:id", verifyToken, async (req, res) => {
    try {
        const deal = await Deal.findById(req.params.id);
        if (!deal) {
            return res.status(404).json({ message: "Deal not found" });
        }
        res.json(deal);
    } catch (error) {
        console.error("Error fetching deal by ID:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// ✅ Approve a deal
router.put("/:id/approve", verifyToken, async (req, res) => {
    try {
        if (req.userRole !== "admin") {
            return res.status(403).json({ message: "Access denied." });
        }
        await Deal.findByIdAndUpdate(req.params.id, { status: "approved" });
        res.json({ message: "Deal approved successfully." });
    } catch (error) {
        console.error("Error approving deal:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// ✅ Deny a deal
router.put("/:id/deny", verifyToken, async (req, res) => {
    try {
        if (req.userRole !== "admin") {
            return res.status(403).json({ message: "Access denied." });
        }
        await Deal.findByIdAndUpdate(req.params.id, { status: "denied" });
        res.json({ message: "Deal denied successfully." });
    } catch (error) {
        console.error("Error denying deal:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

export default router;
