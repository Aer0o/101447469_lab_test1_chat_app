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

// Signup Route
router.post("/signup", async (req, res) => {
    try {
        console.log("Received Signup Data:", req.body); // Debugging log

        const { username, firstname, lastname, password } = req.body;

        // Ensure all fields are provided
        if (!username || !firstname || !lastname || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if the username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({ username, firstname, lastname, password: hashedPassword });
        await newUser.save();

        console.log("User Created Successfully:", newUser);

        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
module.exports = router;


