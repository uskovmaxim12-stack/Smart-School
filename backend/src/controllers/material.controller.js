const Material = require('../models/material.model');

const getMaterials = async (req, res, next) => {
  try {
    const { subject_id, class_id, teacher_id } = req.query;
    const materials = await Material.findAll({ subject_id, class_id, teacher_id });
    res.json(materials);
  } catch (err) {
    next(err);
  }
};

const createMaterial = async (req, res, next) => {
  try {
    const materialData = {
      ...req.body,
      teacher_id: req.user.id,
      file_path: req.file ? req.file.path : null,
    };
    const material = await Material.create(materialData);
    res.status(201).json(material);
  } catch (err) {
    next(err);
  }
};

const deleteMaterial = async (req, res, next) => {
  try {
    await Material.delete(req.params.id);
    res.json({ message: 'Material deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getMaterials, createMaterial, deleteMaterial };
