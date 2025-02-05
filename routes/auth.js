const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Login Route
router.post("/login", async (req, res) => {
    try {
        console.log("Received Login Data:", req.body); // Debugging

        const { username, password } = req.body;

        // Validate input fields
        if (!username || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Find user in the database
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        console.log("Login Successful:", { username, token }); // Debugging

        res.json({
            token,
            user: { username: user.username, firstname: user.firstname, lastname: user.lastname }
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;


