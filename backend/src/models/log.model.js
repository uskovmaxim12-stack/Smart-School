const pool = require('../config/db');

const Log = {
  async create({ user_id, action, details, ip }) {
    const query = `
      INSERT INTO logs (user_id, action, details, ip, created_at)
      VALUES ($1, $2, $3, $4, NOW()) RETURNING *
    `;
    const values = [user_id, action, JSON.stringify(details), ip];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  async findAll(filters = {}) {
    let query = 'SELECT * FROM logs WHERE 1=1';
    const values = [];
    if (filters.user_id) {
      query += ` AND user_id = $${values.length + 1}`;
      values.push(filters.user_id);
    }
    if (filters.action) {
      query += ` AND action = $${values.length + 1}`;
      values.push(filters.action);
    }
    if (filters.startDate) {
      query += ` AND created_at >= $${values.length + 1}`;
      values.push(filters.startDate);
    }
    if (filters.endDate) {
      query += ` AND created_at <= $${values.length + 1}`;
      values.push(filters.endDate);
    }
    query += ' ORDER BY created_at DESC';
    const { rows } = await pool.query(query, values);
    return rows;
  },
};

module.exports = Log;
