const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },  // Added 'name' field
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  status: { type: Number, default: 1 },   // Added 'status' field
  other: { type: String, default: null }  // Added 'other' field
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
