const express = require('express');
const router = express.Router();
const { getAllSubjects, getSubjectById, createSubject, updateSubject, deleteSubject } = require('../controllers/subject.controller');
const { checkRole } = require('../middleware/auth');

router.get('/', getAllSubjects);
router.get('/:id', getSubjectById);
router.post('/', checkRole('admin', 'head_teacher'), createSubject);
router.put('/:id', checkRole('admin', 'head_teacher'), updateSubject);
router.delete('/:id', checkRole('admin', 'head_teacher'), deleteSubject);

module.exports = router;
