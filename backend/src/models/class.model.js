const pool = require('../config/db');

const Class = {
  async create({ name, grade, academic_year, homeroom_teacher_id }) {
    const query = `
      INSERT INTO classes (name, grade, academic_year, homeroom_teacher_id)
      VALUES ($1, $2, $3, $4) RETURNING *
    `;
    const values = [name, grade, academic_year, homeroom_teacher_id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  async findAll() {
    const query = 'SELECT * FROM classes ORDER BY grade, name';
    const { rows } = await pool.query(query);
    return rows;
  },

  async findById(id) {
    const query = 'SELECT * FROM classes WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },

  async update(id, fields) {
    const setClause = Object.keys(fields).map((key, idx) => `${key} = $${idx + 2}`).join(', ');
    const values = [id, ...Object.values(fields)];
    const query = `UPDATE classes SET ${setClause} WHERE id = $1 RETURNING *`;
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  async delete(id) {
    await pool.query('DELETE FROM classes WHERE id = $1', [id]);
  },

  async getStudents(classId) {
    const query = `
      SELECT u.id, u.first_name, u.last_name, u.avatar_url
      FROM users u
      JOIN students s ON u.id = s.user_id
      WHERE s.class_id = $1
    `;
    const { rows } = await pool.query(query, [classId]);
    return rows;
  },
};

module.exports = Class;
