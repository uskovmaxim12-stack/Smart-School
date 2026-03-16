const express = require('express');
const router = express.Router();
const { ask, getConversations, deleteConversation, getKnowledgeBase, createKnowledgeEntry, updateKnowledgeEntry, deleteKnowledgeEntry } = require('../controllers/ai.controller');
const { checkRole } = require('../middleware/auth');

router.post('/ask', ask);
router.get('/conversations', getConversations);
router.delete('/conversations/:id', deleteConversation);
router.get('/knowledge-base', checkRole('admin', 'teacher'), getKnowledgeBase);
router.post('/knowledge-base', checkRole('admin', 'teacher'), createKnowledgeEntry);
router.put('/knowledge-base/:id', checkRole('admin', 'teacher'), updateKnowledgeEntry);
router.delete('/knowledge-base/:id', checkRole('admin', 'teacher'), deleteKnowledgeEntry);

module.exports = router;
