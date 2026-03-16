const AIKnowledge = require('../models/aiKnowledge.model');
const AIConversation = require('../models/aiConversation.model');
const { findBestAnswer } = require('../utils/aiHelper');

const ask = async (req, res, next) => {
  try {
    const { message } = req.body;
    const answer = await findBestAnswer(message);
    // Save conversation
    const conversation = await AIConversation.addMessage(req.user.id, { role: 'user', content: message });
    await AIConversation.addMessage(req.user.id, { role: 'assistant', content: answer }, conversation.id);
    res.json({ answer, conversationId: conversation.id });
  } catch (err) {
    next(err);
  }
};

const getConversations = async (req, res, next) => {
  try {
    const convs = await AIConversation.findByUser(req.user.id);
    res.json(convs);
  } catch (err) {
    next(err);
  }
};

const deleteConversation = async (req, res, next) => {
  try {
    await AIConversation.delete(req.params.id);
    res.json({ message: 'Conversation deleted' });
  } catch (err) {
    next(err);
  }
};

// Knowledge base management (admin/teacher)
const getKnowledgeBase = async (req, res, next) => {
  try {
    const entries = await AIKnowledge.findAll();
    res.json(entries);
  } catch (err) {
    next(err);
  }
};

const createKnowledgeEntry = async (req, res, next) => {
  try {
    const entry = await AIKnowledge.create(req.body);
    res.status(201).json(entry);
  } catch (err) {
    next(err);
  }
};

const updateKnowledgeEntry = async (req, res, next) => {
  try {
    const updated = await AIKnowledge.update(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

const deleteKnowledgeEntry = async (req, res, next) => {
  try {
    await AIKnowledge.delete(req.params.id);
    res.json({ message: 'Entry deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { ask, getConversations, deleteConversation, getKnowledgeBase, createKnowledgeEntry, updateKnowledgeEntry, deleteKnowledgeEntry };
