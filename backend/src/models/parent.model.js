const pool = require('../config/db');

const Parent = {
  async create(userId) {
    const query = 'INSERT INTO parents (user_id) VALUES ($1) RETURNING *';
    const { rows } = await pool.query(query, [userId]);
    return rows[0];
  },

  async linkToStudent(parentId, studentId) {
    const query = 'INSERT INTO parent_student (parent_id, student_id) VALUES ($1, $2)';
    await pool.query(query, [parentId, studentId]);
  },

  async getChildren(parentId) {
    const query = `
      SELECT u.id, u.first_name, u.last_name, u.avatar_url, s.class_id
      FROM users u
      JOIN students s ON u.id = s.user_id
      JOIN parent_student ps ON s.user_id = ps.student_id
      WHERE ps.parent_id = $1
    `;
    const { rows } = await pool.query(query, [parentId]);
    return rows;
  },
};

module.exports = Parent;
