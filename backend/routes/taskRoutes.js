const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Task = require('../models/Task');

// Get all tasks for user
router.get('/', auth, async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create task
router.post('/', auth, async (req, res) => {
    try {
        const { title, description, category, priority, deadlineDate, deadlineTime } = req.body;
        const newTask = new Task({
            userId: req.user.id,
            title,
            description,
            category,
            priority,
            deadlineDate,
            deadlineTime,
        });
        const task = await newTask.save();
        res.json(task);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update task
router.put('/:id', auth, async (req, res) => {
    try {
        const { title, description, category, priority, deadlineDate, deadlineTime, completed } = req.body;
        let task = await Task.findById(req.params.id);

        if (!task) return res.status(404).json({ message: 'Task not found' });
        if (task.userId.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

        task = await Task.findByIdAndUpdate(
            req.params.id,
            { title, description, category, priority, deadlineDate, deadlineTime, completed },
            { new: true }
        );
        res.json(task);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete task
router.delete('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) return res.status(404).json({ message: 'Task not found' });
        if (task.userId.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: 'Task removed' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Toggle completion (Patch)
router.patch('/:id/toggle', auth, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) return res.status(404).json({ message: 'Task not found' });
        if (task.userId.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            { completed: !task.completed },
            { new: true }
        );
        res.json(updatedTask);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
