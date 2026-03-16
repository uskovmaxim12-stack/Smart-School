const Homework = require('../models/homework.model');
const HomeworkSubmission = require('../models/homeworkSubmission.model');

const getHomeworks = async (req, res, next) => {
  try {
    const { class_id, student_id } = req.query;
    if (class_id) {
      const homeworks = await Homework.findByClass(class_id);
      res.json(homeworks);
    } else if (student_id) {
      // find homeworks for student's class
      // ...
    } else {
      res.status(400).json({ message: 'Provide class_id or student_id' });
    }
  } catch (err) {
    next(err);
  }
};

const getHomeworkById = async (req, res, next) => {
  try {
    const homework = await Homework.findById(req.params.id);
    if (!homework) return res.status(404).json({ message: 'Homework not found' });
    res.json(homework);
  } catch (err) {
    next(err);
  }
};

const createHomework = async (req, res, next) => {
  try {
    const homeworkData = { ...req.body, created_by: req.user.id };
    const homework = await Homework.create(homeworkData);
    // TODO: notify students
    res.status(201).json(homework);
  } catch (err) {
    next(err);
  }
};

const updateHomework = async (req, res, next) => {
  try {
    const updated = await Homework.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Homework not found' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

const deleteHomework = async (req, res, next) => {
  try {
    await Homework.delete(req.params.id);
    res.json({ message: 'Homework deleted' });
  } catch (err) {
    next(err);
  }
};

// Submissions
const submitHomework = async (req, res, next) => {
  try {
    const submission = await HomeworkSubmission.create({
      homework_id: req.params.id,
      student_id: req.user.id,
      file_path: req.file ? req.file.path : null,
      comment: req.body.comment,
    });
    res.status(201).json(submission);
  } catch (err) {
    next(err);
  }
};

const gradeSubmission = async (req, res, next) => {
  try {
    const { grade } = req.body;
    const submission = await HomeworkSubmission.grade(req.params.submissionId, grade, req.user.id);
    res.json(submission);
  } catch (err) {
    next(err);
  }
};

module.exports = { getHomeworks, getHomeworkById, createHomework, updateHomework, deleteHomework, submitHomework, gradeSubmission };
