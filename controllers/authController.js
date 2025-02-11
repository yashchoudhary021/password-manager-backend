const User = require('../models/User.js');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../services/authService');

// **Register Controller**
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Trim inputs
        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();

        // Check if user already exists
        let user = await User.findOne({ email: trimmedEmail });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // **Create new user (password hashing handled in Mongoose model)**
        user = new User({ name, email: trimmedEmail, password: trimmedPassword });
        await user.save();

        res.status(201).json({ message: 'User registered successfully', name: user.name, email: user.email });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// **Login Controller**
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Trim inputs
        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();

        // Find user in database
        const user = await User.findOne({ email: trimmedEmail });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(trimmedPassword, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT
        const token = generateToken(user);

        res.status(200).json({ message: "Login successful", id: user._id, name: user.name, email: user.email, token });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { register, login };
