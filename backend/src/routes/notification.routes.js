const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead, deleteRead } = require('../controllers/notification.controller');

router.get('/', getNotifications);
router.put('/:id/read', markAsRead);
router.delete('/read', deleteRead);

module.exports = router;
