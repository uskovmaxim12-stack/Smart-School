const express = require('express');
const router = express.Router();
const { getMaterials, createMaterial, deleteMaterial } = require('../controllers/material.controller');
const { checkRole } = require('../middleware/auth');
const upload = require('../utils/upload');

router.get('/', getMaterials);
router.post('/', checkRole('teacher'), upload.single('file'), createMaterial);
router.delete('/:id', checkRole('teacher', 'admin'), deleteMaterial);

module.exports = router;
