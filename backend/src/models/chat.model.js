const pool = require('../config/db');

const Chat = {
  async createGroup({ name, type, created_by }) {
    const query = `
      INSERT INTO group_chats (name, type, created_by, created_at)
      VALUES ($1, $2, $3, NOW()) RETURNING id
    `;
    const values = [name, type, created_by];
    const { rows } = await pool.query(query, values);
    return rows[0].id;
  },

  async addMember(chatId, userId) {
    await pool.query('INSERT INTO chat_members (chat_id, user_id) VALUES ($1, $2)', [chatId, userId]);
  },

  async getUserChats(userId) {
    const query = `
      SELECT gc.*, 
        (SELECT content FROM group_messages WHERE chat_id = gc.id ORDER BY created_at DESC LIMIT 1) as last_message,
        (SELECT created_at FROM group_messages WHERE chat_id = gc.id ORDER BY created_at DESC LIMIT 1) as last_message_time
      FROM group_chats gc
      JOIN chat_members cm ON gc.id = cm.chat_id
      WHERE cm.user_id = $1
      ORDER BY last_message_time DESC NULLS LAST
    `;
    const { rows } = await pool.query(query, [userId]);
    return rows;
  },

  async getPrivateChats(userId) {
    // Private messages are in messages table, not group_chats
    // We'll handle separately
  },

  async getMessages(chatId, limit = 50, offset = 0) {
    const query = `
      SELECT gm.*, u.first_name, u.last_name, u.avatar_url
      FROM group_messages gm
      JOIN users u ON gm.from_user_id = u.id
      WHERE gm.chat_id = $1
      ORDER BY gm.created_at DESC
      LIMIT $2 OFFSET $3
    `;
    const { rows } = await pool.query(query, [chatId, limit, offset]);
    return rows.reverse();
  },

  async saveGroupMessage({ chat_id, from_user_id, content }) {
    const query = `
      INSERT INTO group_messages (chat_id, from_user_id, content, created_at)
      VALUES ($1, $2, $3, NOW()) RETURNING *
    `;
    const { rows } = await pool.query(query, [chat_id, from_user_id, content]);
    return rows[0];
  },
};

module.exports = Chat;
