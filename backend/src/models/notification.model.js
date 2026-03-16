const pool = require('../config/db');

const Notification = {
  async create({ user_id, type, content, link }) {
    const query = `
      INSERT INTO notifications (user_id, type, content, link, created_at)
      VALUES ($1, $2, $3, $4, NOW()) RETURNING *
    `;
    const values = [user_id, type, content, link];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  async findForUser(userId) {
    const query = `
      SELECT * FROM notifications
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;
    const { rows } = await pool.query(query, [userId]);
    return rows;
  },

  async markAsRead(id) {
    await pool.query('UPDATE notifications SET is_read = true WHERE id = $1', [id]);
  },

  async deleteRead(userId) {
    await pool.query('DELETE FROM notifications WHERE user_id = $1 AND is_read = true', [userId]);
  },
};

module.exports = Notification;
