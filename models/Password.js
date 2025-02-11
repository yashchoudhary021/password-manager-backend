const mongoose = require('mongoose');

const passwordSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true }, // Encrypted
    website: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Password', passwordSchema);
