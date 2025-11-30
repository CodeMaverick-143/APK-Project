const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    profilePicture: { type: String },
    description: { type: String },
    settings: {
        theme: { type: String, default: 'system' },
        layout: { type: String, default: 'comfortable' },
        hapticsEnabled: { type: Boolean, default: true },
        gestureSensitivity: { type: Number, default: 1.0 },
    },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
