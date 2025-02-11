const express = require('express');
const CryptoJS = require('crypto-js');
const Password = require('../models/Password'); // Ensure this model exists
const authMiddleware = require('../middleware/authMiddleware');
require('dotenv').config();

const router = express.Router();

// Encryption secret key
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "mySecretKey";

// 🔹 Create a new password entry
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { name, username, password, website } = req.body;
        const userId = req.user.id; // Extracted from JWT

        // Encrypt password before saving
        const encryptedPassword = CryptoJS.AES.encrypt(password, ENCRYPTION_KEY).toString();

        const newPassword = new Password({ userId, name, username, password: encryptedPassword, website });
        await newPassword.save();

        res.status(201).json({ message: 'Password saved successfully', data: newPassword });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// 🔹 Get all saved passwords for the logged-in user
router.get('/', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const passwords = await Password.find({ userId });

        // Decrypt passwords before sending response
        const decryptedPasswords = passwords.map(entry => ({
            _id: entry._id,
            userId: entry.userId,
            name: entry.name,
            username: entry.username,
            password: CryptoJS.AES.decrypt(entry.password, ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8),
            website: entry.website,
            createdAt: entry.createdAt,
            updatedAt: entry.updatedAt
        }));

        res.json(decryptedPasswords);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// 🔹 Update a saved password
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { name, username, password, website } = req.body;

        // Encrypt the new password
        const encryptedPassword = CryptoJS.AES.encrypt(password, ENCRYPTION_KEY).toString();

        const updatedPassword = await Password.findByIdAndUpdate(
            req.params.id,
            { name, username, password: encryptedPassword, website },
            { new: true }
        );

        if (!updatedPassword) {
            return res.status(404).json({ message: 'Password entry not found' });
        }

        res.json({ message: 'Password updated successfully', data: updatedPassword });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// 🔹 Delete a saved password
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const deletedPassword = await Password.findByIdAndDelete(req.params.id);

        if (!deletedPassword) {
            return res.status(404).json({ message: 'Password entry not found' });
        }

        res.json({ message: 'Password deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
