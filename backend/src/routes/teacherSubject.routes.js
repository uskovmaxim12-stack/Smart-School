const express = require('express');
const router = express.Router();
const { assignTeacherSubject, getTeacherSubjects, deleteTeacherSubject } = require('../controllers/teacherSubject.controller');
const { checkRole } = require('../middleware/auth');

router.get('/', checkRole('head_teacher', 'director'), getTeacherSubjects);
router.post('/', checkRole('head_teacher'), assignTeacherSubject);
router.delete('/:id', checkRole('head_teacher'), deleteTeacherSubject);

module.exports = router;
