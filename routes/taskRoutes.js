const express = require('express');
const router = express.Router();
const { createTask, updateTaskStatus, deleteTask } = require('../controllers/taskController');

router.post('/create', createTask);
router.patch('/:userId/:taskId/status', updateTaskStatus);
router.delete('/:userId/:taskId', deleteTask);

module.exports = router;
