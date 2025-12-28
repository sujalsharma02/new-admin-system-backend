const User = require('../models/User');

// @desc    Get all employees
// @route   GET /api/employees
// @access  Admin
const getEmployees = async (req, res) => {
    try {
        const employees = await User.find({ role: 'employee' });
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getEmployees };
