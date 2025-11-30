const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String, default: 'Personal' },
    priority: { type: String, default: 'Medium' },
    deadlineDate: { type: String }, // YYYY-MM-DD
    deadlineTime: { type: String }, // HH:mm
    completed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Task', taskSchema);
