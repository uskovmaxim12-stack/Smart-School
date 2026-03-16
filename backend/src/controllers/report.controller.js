const pool = require('../config/db');

const performanceReport = async (req, res, next) => {
  try {
    const { grade, class_id, subject_id, period_start, period_end } = req.query;
    // Build query based on filters
    let query = `
      SELECT 
        c.name as class_name,
        s.name as subject_name,
        AVG(g.value) as average_grade,
        COUNT(g.id) as grade_count
      FROM grades g
      JOIN lessons l ON g.lesson_id = l.id
      JOIN classes c ON l.class_id = c.id
      JOIN subjects s ON l.subject_id = s.id
      WHERE 1=1
    `;
    const values = [];
    if (class_id) {
      query += ` AND l.class_id = $${values.length + 1}`;
      values.push(class_id);
    }
    if (subject_id) {
      query += ` AND l.subject_id = $${values.length + 1}`;
      values.push(subject_id);
    }
    if (period_start) {
      query += ` AND g.date >= $${values.length + 1}`;
      values.push(period_start);
    }
    if (period_end) {
      query += ` AND g.date <= $${values.length + 1}`;
      values.push(period_end);
    }
    query += ' GROUP BY c.name, s.name';
    const { rows } = await pool.query(query, values);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

const attendanceReport = async (req, res, next) => {
  // similar
  res.json([]);
};

module.exports = { performanceReport, attendanceReport };
