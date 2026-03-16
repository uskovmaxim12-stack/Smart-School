const pool = require('../config/db');

const AIKnowledge = {
  async create({ keywords, question_pattern, answer_template, subject_id, grade }) {
    const query = `
      INSERT INTO ai_knowledge_base (keywords, question_pattern, answer_template, subject_id, grade)
      VALUES ($1, $2, $3, $4, $5) RETURNING *
    `;
    const values = [keywords, question_pattern, answer_template, subject_id, grade];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  async findAll() {
    const query = 'SELECT * FROM ai_knowledge_base';
    const { rows } = await pool.query(query);
    return rows;
  },

  async findRelevant(queryText) {
    // Simple keyword matching: we'll search for any keyword in the query
    // For performance, we can use full-text search in PostgreSQL, but for simplicity:
    const keywordsArray = queryText.toLowerCase().split(/\W+/).filter(w => w.length > 2);
    if (keywordsArray.length === 0) return [];

    // Build WHERE clause: keywords && ARRAY[keywordsArray] (overlap)
    const placeholders = keywordsArray.map((_, i) => `$${i + 1}`).join(', ');
    const query = `
      SELECT * FROM ai_knowledge_base
      WHERE keywords && ARRAY[${placeholders}]
      ORDER BY array_length(keywords, 1) DESC
    `;
    const { rows } = await pool.query(query, keywordsArray);
    return rows;
  },

  async update(id, fields) {
    const setClause = Object.keys(fields).map((key, idx) => `${key} = $${idx + 2}`).join(', ');
    const values = [id, ...Object.values(fields)];
    const query = `UPDATE ai_knowledge_base SET ${setClause} WHERE id = $1 RETURNING *`;
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  async delete(id) {
    await pool.query('DELETE FROM ai_knowledge_base WHERE id = $1', [id]);
  },
};

module.exports = AIKnowledge;
