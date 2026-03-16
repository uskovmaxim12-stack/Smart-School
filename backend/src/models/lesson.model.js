const pool = require('../config/db');

const Lesson = {
  async create({ class_id, subject_id, teacher_id, day_of_week, lesson_number, room, start_time, end_time }) {
    const query = `
      INSERT INTO lessons (class_id, subject_id, teacher_id, day_of_week, lesson_number, room, start_time, end_time)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *
    `;
    const values = [class_id, subject_id, teacher_id, day_of_week, lesson_number, room, start_time, end_time];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  async findConflicts(teacher_id, day_of_week, lesson_number, excludeId = null) {
    let query = `
      SELECT * FROM lessons
      WHERE teacher_id = $1 AND day_of_week = $2 AND lesson_number = $3
    `;
    const values = [teacher_id, day_of_week, lesson_number];
    if (excludeId) {
      query += ' AND id != $4';
      values.push(excludeId);
    }
    const { rows } = await pool.query(query, values);
    return rows;
  },

  async findByClassAndWeek(classId, startDate, endDate) {
    // For schedule, we need to join with exceptions? We'll handle in service.
    const query = `
      SELECT l.*, s.name as subject_name, u.first_name, u.last_name
      FROM lessons l
      JOIN subjects s ON l.subject_id = s.id
      JOIN users u ON l.teacher_id = u.id
      WHERE l.class_id = $1
      ORDER BY l.day_of_week, l.lesson_number
    `;
    const { rows } = await pool.query(query, [classId]);
    return rows;
  },

  async update(id, fields) {
    const setClause = Object.keys(fields).map((key, idx) => `${key} = $${idx + 2}`).join(', ');
    const values = [id, ...Object.values(fields)];
    const query = `UPDATE lessons SET ${setClause} WHERE id = $1 RETURNING *`;
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  async delete(id) {
    await pool.query('DELETE FROM lessons WHERE id = $1', [id]);
  },
};

module.exports = Lesson;
