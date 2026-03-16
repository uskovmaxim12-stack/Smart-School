const pool = require('../config/db');

const Teacher = {
  async create(userId) {
    const query = 'INSERT INTO teachers (user_id) VALUES ($1) RETURNING *';
    const { rows } = await pool.query(query, [userId]);
    return rows[0];
  },

  async findByUserId(userId) {
    const query = 'SELECT * FROM teachers WHERE user_id = $1';
    const { rows } = await pool.query(query, [userId]);
    return rows[0];
  },
};

module.exports = Teacher;
