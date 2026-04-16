const { Attendance } = require('../models');
const { Op } = require('sequelize');

const getTodayStatus = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0]; 
    const record = await Attendance.findOne({
      where: { employee_id: req.employee.id, date: today },
    });

    if (!record) {
      return res.status(200).json({ status: 'not_checked_in', record: null });
    }

    return res.status(200).json({ status: record.status, record });
  } catch (err) {
    console.error('getTodayStatus error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};
const checkIn = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const existing = await Attendance.findOne({
      where: { employee_id: req.employee.id, date: today },
    });

    if (existing) {
      return res.status(409).json({ error: 'You have already checked in today.' });
    }

    const record = await Attendance.create({
      employee_id: req.employee.id,
      date: today,
      check_in_time: new Date(),
      status: 'checked_in',
    });

    return res.status(201).json({ message: 'Checked in successfully.', record });
  } catch (err) {
    console.error('checkIn error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

const checkOut = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const record = await Attendance.findOne({
      where: { employee_id: req.employee.id, date: today },
    });

    if (!record) {
      return res.status(404).json({ error: 'You have not checked in today.' });
    }

    if (record.status === 'checked_out') {
      return res.status(409).json({ error: 'You have already checked out today.' });
    }

    const checkOutTime = new Date();
    const checkInTime = new Date(record.check_in_time);
    const totalHours = ((checkOutTime - checkInTime) / (1000 * 60 * 60)).toFixed(2);

    await record.update({
      check_out_time: checkOutTime,
      total_hours: totalHours,
      status: 'checked_out',
    });

    return res.status(200).json({ message: 'Checked out successfully.', record });
  } catch (err) {
    console.error('checkOut error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};
const getTimesheet = async (req, res) => {
  try {
    const { month, year, start_date, end_date, page = 1, limit = 20 } = req.query;
    const where = { employee_id: req.employee.id };

    if (start_date && end_date) {
      where.date = { [Op.between]: [start_date, end_date] };
    } else if (month && year) {
      const startOfMonth = `${year}-${String(month).padStart(2, '0')}-01`;
      const endOfMonth = new Date(year, month, 0).toISOString().split('T')[0];
      where.date = { [Op.between]: [startOfMonth, endOfMonth] };
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await Attendance.findAndCountAll({
      where,
      order: [['date', 'DESC']],
      limit: parseInt(limit),
      offset,
    });

    return res.status(200).json({
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      records: rows,
    });
  } catch (err) {
    console.error('getTimesheet error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

module.exports = { getTodayStatus, checkIn, checkOut, getTimesheet };
