const express = require('express');
const router = express.Router();
const { getLogs, getBackup, getServerStats, getSettings, updateSettings } = require('../controllers/admin.controller');
const { checkRole } = require('../middleware/auth');

router.get('/logs', checkRole('admin'), getLogs);
router.get('/backup', checkRole('admin'), getBackup);
router.get('/stats', checkRole('admin'), getServerStats);
router.get('/settings', checkRole('admin'), getSettings);
router.put('/settings', checkRole('admin'), updateSettings);

module.exports = router;
