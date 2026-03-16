const express = require('express');
const router = express.Router();
const { getAllClasses, getClassById, createClass, updateClass, deleteClass, assignHomeroomTeacher, addStudent } = require('../controllers/class.controller');
const { checkRole } = require('../middleware/auth');

router.get('/', getAllClasses);
router.get('/:id', getClassById);
router.post('/', checkRole('head_teacher'), createClass);
router.put('/:id', checkRole('head_teacher'), updateClass);
router.delete('/:id', checkRole('head_teacher'), deleteClass);
router.post('/:id/assign-teacher', checkRole('head_teacher'), assignHomeroomTeacher);
router.post('/:id/students', checkRole('head_teacher'), addStudent);

module.exports = router;
