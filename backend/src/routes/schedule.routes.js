const express = require('express');
const router = express.Router();
const { getSchedule, createLesson, updateLesson, deleteLesson } = require('../controllers/schedule.controller');
const { checkRole } = require('../middleware/auth');

router.get('/', getSchedule);
router.post('/', checkRole('head_teacher'), createLesson);
router.put('/:id', checkRole('head_teacher'), updateLesson);
router.delete('/:id', checkRole('head_teacher'), deleteLesson);

module.exports = router;
