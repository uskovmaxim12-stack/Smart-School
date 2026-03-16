const { WebSocketServer } = require('ws');
const jwt = require('jsonwebtoken');
const { accessSecret } = require('../config/jwt');
const Chat = require('../models/chat.model');
const Notification = require('../models/notification.model');

const clients = new Map(); // userId -> WebSocket

const setupWebSocket = (server) => {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws, req) => {
    const token = new URL(req.url, `http://${req.headers.host}`).searchParams.get('token');
    if (!token) {
      ws.close(4001, 'No token');
      return;
    }

    let user;
    try {
      user = jwt.verify(token, accessSecret);
    } catch (err) {
      ws.close(4002, 'Invalid token');
      return;
    }

    const userId = user.id;
    clients.set(userId, ws);

    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data);
        switch (message.type) {
          case 'ping':
            ws.send(JSON.stringify({ type: 'pong' }));
            break;
          case 'message':
            await handleGroupMessage(userId, message);
            break;
          case 'read':
            // handle read receipts
            break;
          case 'typing':
            // broadcast typing to chat members
            break;
        }
      } catch (err) {
        console.error('WebSocket message error:', err);
      }
    });

    ws.on('close', () => {
      clients.delete(userId);
    });
  });
};

const handleGroupMessage = async (userId, { chatId, content }) => {
  const message = await Chat.saveGroupMessage({
    chat_id: chatId,
    from_user_id: userId,
    content,
  });

  // Get all members of this chat
  const members = await Chat.getMembers(chatId); // we need to implement this
  for (const memberId of members) {
    const client = clients.get(memberId);
    if (client && client.readyState === client.OPEN) {
      client.send(JSON.stringify({
        type: 'new_message',
        chatId,
        message,
      }));
    } else {
      // Create notification for offline user
      await Notification.create({
        user_id: memberId,
        type: 'message',
        content: `Новое сообщение в чате`,
        link: `/chats/${chatId}`,
      });
    }
  }
};

const sendNotification = (userId, notification) => {
  const client = clients.get(userId);
  if (client && client.readyState === client.OPEN) {
    client.send(JSON.stringify({ type: 'notification', notification }));
  }
};

module.exports = { setupWebSocket, sendNotification };
