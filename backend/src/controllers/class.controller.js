const Class = require('../models/class.model');
const Student = require('../models/student.model');

const getAllClasses = async (req, res, next) => {
  try {
    const classes = await Class.findAll();
    res.json(classes);
  } catch (err) {
    next(err);
  }
};

const getClassById = async (req, res, next) => {
  try {
    const cls = await Class.findById(req.params.id);
    if (!cls) return res.status(404).json({ message: 'Class not found' });
    const students = await Class.getStudents(req.params.id);
    res.json({ ...cls, students });
  } catch (err) {
    next(err);
  }
};

const createClass = async (req, res, next) => {
  try {
    const { name, grade, academic_year, homeroom_teacher_id } = req.body;
    const newClass = await Class.create({ name, grade, academic_year, homeroom_teacher_id });
    res.status(201).json(newClass);
  } catch (err) {
    next(err);
  }
};

const updateClass = async (req, res, next) => {
  try {
    const updated = await Class.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Class not found' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

const deleteClass = async (req, res, next) => {
  try {
    await Class.delete(req.params.id);
    res.json({ message: 'Class deleted' });
  } catch (err) {
    next(err);
  }
};

const assignHomeroomTeacher = async (req, res, next) => {
  try {
    const { teacher_id } = req.body;
    const updated = await Class.update(req.params.id, { homeroom_teacher_id: teacher_id });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

const addStudent = async (req, res, next) => {
  try {
    const { student_id } = req.body;
    await Student.updateClass(student_id, req.params.id);
    res.json({ message: 'Student added to class' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllClasses, getClassById, createClass, updateClass, deleteClass, assignHomeroomTeacher, addStudent };
