const express = require('express');
const router = express.Router();
const { getHomeworks, getHomeworkById, createHomework, updateHomework, deleteHomework, submitHomework, gradeSubmission } = require('../controllers/homework.controller');
const { checkRole } = require('../middleware/auth');
const upload = require('../utils/upload');

router.get('/', getHomeworks);
router.get('/:id', getHomeworkById);
router.post('/', checkRole('teacher'), createHomework);
router.put('/:id', checkRole('teacher'), updateHomework);
router.delete('/:id', checkRole('teacher'), deleteHomework);
router.post('/:id/submit', checkRole('student'), upload.single('file'), submitHomework);
router.post('/submissions/:submissionId/grade', checkRole('teacher'), gradeSubmission);

module.exports = router;
