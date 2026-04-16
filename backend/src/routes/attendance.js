const express = require('express');
const router = express.Router();
const { getTodayStatus, checkIn, checkOut, getTimesheet } = require('../controllers/attendanceController');
const { authenticate } = require('../middleware/auth');

router.get('/today', authenticate, getTodayStatus);
router.post('/check-in', authenticate, checkIn);
router.post('/check-out', authenticate, checkOut);
router.get('/timesheet', authenticate, getTimesheet);

module.exports = router;
