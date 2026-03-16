const express = require('express');
const router = express.Router();
const { getUserChats, getChatMessages, sendGroupMessage, createGroupChat } = require('../controllers/chat.controller');
const { checkRole } = require('../middleware/auth');

router.get('/', getUserChats);
router.get('/:chatId/messages', getChatMessages);
router.post('/:chatId/messages', sendGroupMessage);
router.post('/', checkRole('admin', 'teacher'), createGroupChat);

module.exports = router;
