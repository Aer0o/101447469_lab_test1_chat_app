const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

// Signup Route
router.post("/signup", async (req, res) => {
    try {
        console.log("Received Signup Data:", req.body); // Debugging

        const { username, firstname, lastname, password } = req.body;

        if (!username || !firstname || !lastname || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ username, firstname, lastname, password: hashedPassword });
        await newUser.save();

        console.log("Signup Successful:", newUser);
        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;


