const { LeaveRequest } = require('../models');
const { Op } = require('sequelize');

const applyLeave = async (req, res) => {
  try {
    const { start_date, end_date, leave_type, reason } = req.body;

    if (!start_date || !end_date || !leave_type || !reason) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    if (new Date(end_date) < new Date(start_date)) {
      return res.status(400).json({ error: 'End date cannot be before start date.' });
    }

    const validTypes = ['sick', 'casual', 'annual', 'unpaid', 'other'];
    if (!validTypes.includes(leave_type)) {
      return res.status(400).json({ error: 'Invalid leave type.' });
    }

    const leave = await LeaveRequest.create({
      employee_id: req.employee.id,
      start_date,
      end_date,
      leave_type,
      reason,
      status: 'pending',
    });

    return res.status(201).json({ message: 'Leave request submitted successfully.', leave });
  } catch (err) {
    console.error('applyLeave error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};
const getMyLeaves = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const where = { employee_id: req.employee.id };

    if (status) {
      where.status = status;
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await LeaveRequest.findAndCountAll({
      where,
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset,
    });

    return res.status(200).json({
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      leaves: rows,
    });
  } catch (err) {
    console.error('getMyLeaves error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

module.exports = { applyLeave, getMyLeaves };
