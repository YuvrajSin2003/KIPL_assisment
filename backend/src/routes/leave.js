const express = require('express');
const router = express.Router();
const { applyLeave, getMyLeaves } = require('../controllers/leaveController');
const { authenticate } = require('../middleware/auth');

router.post('/', authenticate, applyLeave);
router.get('/', authenticate, getMyLeaves);

module.exports = router;
