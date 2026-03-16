const express = require('express');
const router = express.Router();
const { performanceReport, attendanceReport } = require('../controllers/report.controller');
const { checkRole } = require('../middleware/auth');

router.get('/performance', checkRole('director', 'head_teacher'), performanceReport);
router.get('/attendance', checkRole('director', 'head_teacher'), attendanceReport);

module.exports = router;
