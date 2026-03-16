const Subject = require('../models/subject.model');

const getAllSubjects = async (req, res, next) => {
  try {
    const subjects = await Subject.findAll();
    res.json(subjects);
  } catch (err) {
    next(err);
  }
};

const getSubjectById = async (req, res, next) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ message: 'Subject not found' });
    res.json(subject);
  } catch (err) {
    next(err);
  }
};

const createSubject = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const subject = await Subject.create({ name, description });
    res.status(201).json(subject);
  } catch (err) {
    next(err);
  }
};

const updateSubject = async (req, res, next) => {
  try {
    const updated = await Subject.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Subject not found' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

const deleteSubject = async (req, res, next) => {
  try {
    await Subject.delete(req.params.id);
    res.json({ message: 'Subject deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllSubjects, getSubjectById, createSubject, updateSubject, deleteSubject };
