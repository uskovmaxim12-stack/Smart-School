const Grade = require('../models/grade.model');

const getGrades = async (req, res, next) => {
  try {
    const { student_id, class_id, subject_id, period_start, period_end } = req.query;
    if (!student_id) return res.status(400).json({ message: 'student_id required' });
    const grades = await Grade.findByStudent(student_id, period_start, period_end);
    res.json(grades);
  } catch (err) {
    next(err);
  }
};

const createGrade = async (req, res, next) => {
  try {
    const gradeData = { ...req.body, created_by: req.user.id };
    const grade = await Grade.create(gradeData);
    // TODO: create notification for student
    res.status(201).json(grade);
  } catch (err) {
    next(err);
  }
};

const updateGrade = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { value, comment } = req.body;
    const updated = await Grade.update(id, { value, comment });
    if (!updated) return res.status(404).json({ message: 'Grade not found' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

const deleteGrade = async (req, res, next) => {
  try {
    await Grade.delete(req.params.id);
    res.json({ message: 'Grade deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getGrades, createGrade, updateGrade, deleteGrade };
