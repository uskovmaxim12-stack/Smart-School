const pool = require('../config/db');

const Student = {
  async create(userId, classId) {
    const query = 'INSERT INTO students (user_id, class_id) VALUES ($1, $2) RETURNING *';
    const { rows } = await pool.query(query, [userId, classId]);
    return rows[0];
  },

  async findByUserId(userId) {
    const query = 'SELECT * FROM students WHERE user_id = $1';
    const { rows } = await pool.query(query, [userId]);
    return rows[0];
  },

  async getClassmates(studentId) {
    const query = `
      SELECT u.id, u.first_name, u.last_name, u.avatar_url
      FROM users u
      JOIN students s ON u.id = s.user_id
      WHERE s.class_id = (SELECT class_id FROM students WHERE user_id = $1)
    `;
    const { rows } = await pool.query(query, [studentId]);
    return rows;
  },

  async updateClass(userId, classId) {
    await pool.query('UPDATE students SET class_id = $1 WHERE user_id = $2', [classId, userId]);
  },
};

module.exports = Student;
