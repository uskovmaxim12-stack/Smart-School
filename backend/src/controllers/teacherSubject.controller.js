const TeacherSubject = require('../models/teacherSubject.model');

const assignTeacherSubject = async (req, res, next) => {
  try {
    const { teacher_id, subject_id, class_id } = req.body;
    const assignment = await TeacherSubject.assign({ teacher_id, subject_id, class_id });
    res.status(201).json(assignment);
  } catch (err) {
    next(err);
  }
};

const getTeacherSubjects = async (req, res, next) => {
  try {
    const { teacher_id, class_id } = req.query;
    let result;
    if (teacher_id) {
      result = await TeacherSubject.findByTeacher(teacher_id);
    } else if (class_id) {
      result = await TeacherSubject.findByClass(class_id);
    } else {
      return res.status(400).json({ message: 'Provide teacher_id or class_id' });
    }
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const deleteTeacherSubject = async (req, res, next) => {
  try {
    await TeacherSubject.delete(req.params.id);
    res.json({ message: 'Assignment deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { assignTeacherSubject, getTeacherSubjects, deleteTeacherSubject };
