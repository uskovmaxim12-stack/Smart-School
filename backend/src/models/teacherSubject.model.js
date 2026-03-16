const pool = require('../config/db');

const TeacherSubject = {
  async assign({ teacher_id, subject_id, class_id }) {
    const query = `
      INSERT INTO teacher_subjects (teacher_id, subject_id, class_id)
      VALUES ($1, $2, $3) RETURNING *
    `;
    const values = [teacher_id, subject_id, class_id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  async findByTeacher(teacherId) {
    const query = `
      SELECT ts.*, s.name as subject_name, c.name as class_name
      FROM teacher_subjects ts
      JOIN subjects s ON ts.subject_id = s.id
      JOIN classes c ON ts.class_id = c.id
      WHERE ts.teacher_id = $1
    `;
    const { rows } = await pool.query(query, [teacherId]);
    return rows;
  },

  async findByClass(classId) {
    const query = `
      SELECT ts.*, u.first_name, u.last_name, s.name as subject_name
      FROM teacher_subjects ts
      JOIN users u ON ts.teacher_id = u.id
      JOIN subjects s ON ts.subject_id = s.id
      WHERE ts.class_id = $1
    `;
    const { rows } = await pool.query(query, [classId]);
    return rows;
  },

  async delete(id) {
    await pool.query('DELETE FROM teacher_subjects WHERE id = $1', [id]);
  },
};

module.exports = TeacherSubject;
