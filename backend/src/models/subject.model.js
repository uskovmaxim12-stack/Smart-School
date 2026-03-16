const pool = require('../config/db');

const Subject = {
  async create({ name, description }) {
    const query = 'INSERT INTO subjects (name, description) VALUES ($1, $2) RETURNING *';
    const values = [name, description];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  async findAll() {
    const query = 'SELECT * FROM subjects ORDER BY name';
    const { rows } = await pool.query(query);
    return rows;
  },

  async findById(id) {
    const query = 'SELECT * FROM subjects WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },

  async update(id, fields) {
    const setClause = Object.keys(fields).map((key, idx) => `${key} = $${idx + 2}`).join(', ');
    const values = [id, ...Object.values(fields)];
    const query = `UPDATE subjects SET ${setClause} WHERE id = $1 RETURNING *`;
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  async delete(id) {
    await pool.query('DELETE FROM subjects WHERE id = $1', [id]);
  },
};

module.exports = Subject;
