const User = require('../models/User');

// @desc    Delete a task
// @route   DELETE /api/tasks/:userId/:taskId
// @access  Admin


// @desc    Create a new task
// @route   POST /api/tasks/create
// @access  Admin
const createTask = async (req, res) => {
    const { taskTitle, taskDescription, taskDate, category, assignTo } = req.body;

    try {
        const user = await User.findOne({ firstName: assignTo });

        if (!user) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        const newTask = {
            taskTitle,
            taskDescription,
            taskDate,
            category,
            active: false,
            newTask: true,
            failed: false,
            completed: false,
            completed: false
        };

        user.tasks.push(newTask);

        // Update task counts
        user.taskCounts.newTask += 1;

        await user.save();



        res.status(201).json({ message: 'Task created and assigned', data: user });
    } catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update task status
// @route   PATCH /api/tasks/:userId/:taskId/status
// @access  Employee
const updateTaskStatus = async (req, res) => {
    const { userId, taskId } = req.params;
    const { status } = req.body; // 'completed' or 'failed'

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const task = user.tasks.id(taskId);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Update task status
        if (status === 'completed') {
            task.completed = true;
            task.active = false;
            user.taskCounts.completed += 1;
            user.taskCounts.active = Math.max(0, user.taskCounts.active - 1);
        } else if (status === 'failed') {
            task.failed = true;
            task.active = false;
            user.taskCounts.failed += 1;
            user.taskCounts.active = Math.max(0, user.taskCounts.active - 1);
        } else if (status === 'active') {
            task.active = true;
            task.newTask = false;
            user.taskCounts.active += 1;
            user.taskCounts.newTask = Math.max(0, user.taskCounts.newTask - 1);
        }

        await user.save();



        res.json({ message: `Task marked as ${status}`, data: user });
    } catch (error) {
        console.error("Error updating task status:", error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:userId/:taskId
// @access  Admin
const deleteTask = async (req, res) => {
    const { userId, taskId } = req.params;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Filter out the task to be deleted
        user.tasks = user.tasks.filter(task => task._id.toString() !== taskId);

        // Recalculate task counts
        user.taskCounts.active = user.tasks.filter(t => t.active).length;
        user.taskCounts.newTask = user.tasks.filter(t => t.newTask).length;
        user.taskCounts.completed = user.tasks.filter(t => t.completed).length;
        user.taskCounts.failed = user.tasks.filter(t => t.failed).length;

        await user.save();

        res.json({ message: 'Task removed', data: user });
    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createTask, updateTaskStatus, deleteTask };
