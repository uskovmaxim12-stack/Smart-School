const Chat = require('../models/chat.model');
const Message = require('../models/message.model'); // for private messages

const getUserChats = async (req, res, next) => {
  try {
    const groupChats = await Chat.getUserChats(req.user.id);
    // Also get private chats (one-to-one) from messages table
    const privateChats = await Message.getUserPrivateChats(req.user.id);
    res.json({ groupChats, privateChats });
  } catch (err) {
    next(err);
  }
};

const getChatMessages = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const { limit = 50, offset = 0 } = req.query;
    const messages = await Chat.getMessages(chatId, limit, offset);
    res.json(messages);
  } catch (err) {
    next(err);
  }
};

const sendGroupMessage = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const { content } = req.body;
    const message = await Chat.saveGroupMessage({
      chat_id: chatId,
      from_user_id: req.user.id,
      content,
    });
    // Notify via WebSocket later
    res.status(201).json(message);
  } catch (err) {
    next(err);
  }
};

const createGroupChat = async (req, res, next) => {
  try {
    const { name, type, member_ids } = req.body;
    const chatId = await Chat.createGroup({ name, type, created_by: req.user.id });
    await Chat.addMember(chatId, req.user.id); // add creator
    for (const uid of member_ids) {
      await Chat.addMember(chatId, uid);
    }
    res.status(201).json({ chatId });
  } catch (err) {
    next(err);
  }
};

module.exports = { getUserChats, getChatMessages, sendGroupMessage, createGroupChat };
