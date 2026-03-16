const pool = require('../config/db');

const Grade = {
  async create({ student_id, lesson_id, value, comment, created_by }) {
    const query = `
      INSERT INTO grades (student_id, lesson_id, value, comment, date, created_by)
      VALUES ($1, $2, $3, $4, NOW(), $5) RETURNING *
    `;
    const values = [student_id, lesson_id, value, comment, created_by];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  async findByStudent(studentId, periodStart, periodEnd) {
    const query = `
      SELECT g.*, l.subject_id, s.name as subject_name, l.lesson_number, l.date as lesson_date
      FROM grades g
      JOIN lessons l ON g.lesson_id = l.id
      JOIN subjects s ON l.subject_id = s.id
      WHERE g.student_id = $1 AND g.date BETWEEN $2 AND $3
      ORDER BY g.date
    `;
    const { rows } = await pool.query(query, [studentId, periodStart, periodEnd]);
    return rows;
  },

  async update(id, { value, comment }) {
    const query = 'UPDATE grades SET value = $1, comment = $2 WHERE id = $3 RETURNING *';
    const { rows } = await pool.query(query, [value, comment, id]);
    return rows[0];
  },

  async delete(id) {
    await pool.query('DELETE FROM grades WHERE id = $1', [id]);
  },
};

module.exports = Grade;
