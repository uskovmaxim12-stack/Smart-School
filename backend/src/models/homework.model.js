const pool = require('../config/db');

const Homework = {
  async create({ lesson_id, title, description, due_date, attachments, created_by }) {
    const query = `
      INSERT INTO homeworks (lesson_id, title, description, due_date, attachments, created_by, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *
    `;
    const values = [lesson_id, title, description, due_date, JSON.stringify(attachments), created_by];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  async findByClass(classId) {
    const query = `
      SELECT h.*, l.subject_id, s.name as subject_name, l.lesson_number
      FROM homeworks h
      JOIN lessons l ON h.lesson_id = l.id
      JOIN subjects s ON l.subject_id = s.id
      WHERE l.class_id = $1
      ORDER BY h.due_date
    `;
    const { rows } = await pool.query(query, [classId]);
    return rows;
  },

  async findById(id) {
    const query = 'SELECT * FROM homeworks WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },

  async update(id, fields) {
    const setClause = Object.keys(fields).map((key, idx) => `${key} = $${idx + 2}`).join(', ');
    const values = [id, ...Object.values(fields)];
    const query = `UPDATE homeworks SET ${setClause} WHERE id = $1 RETURNING *`;
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  async delete(id) {
    await pool.query('DELETE FROM homeworks WHERE id = $1', [id]);
  },
};

module.exports = Homework;
