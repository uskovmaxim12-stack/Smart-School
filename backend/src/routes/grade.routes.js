const express = require('express');
const router = express.Router();
const { getGrades, createGrade, updateGrade, deleteGrade } = require('../controllers/grade.controller');
const { checkRole } = require('../middleware/auth');

router.get('/', getGrades);
router.post('/', checkRole('teacher'), createGrade);
router.put('/:id', checkRole('teacher', 'head_teacher'), updateGrade);
router.delete('/:id', checkRole('teacher', 'head_teacher'), deleteGrade);

module.exports = router;
