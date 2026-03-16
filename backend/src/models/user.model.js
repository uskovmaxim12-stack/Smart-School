const pool = require('../config/db');
const bcrypt = require('bcrypt');

const User = {
  async create({ email, password, role, first_name, last_name, avatar_url = null }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `
      INSERT INTO users (email, password_hash, role, first_name, last_name, avatar_url, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING id, email, role, first_name, last_name, avatar_url, created_at
    `;
    const values = [email, hashedPassword, role, first_name, last_name, avatar_url];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const { rows } = await pool.query(query, [email]);
    return rows[0];
  },

  async findById(id) {
    const query = 'SELECT id, email, role, first_name, last_name, avatar_url, is_blocked, created_at, last_login_at FROM users WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },

  async updateLastLogin(id) {
    await pool.query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [id]);
  },

  async getAll(filters = {}) {
    let query = 'SELECT id, email, role, first_name, last_name, avatar_url, is_blocked, created_at FROM users';
    const conditions = [];
    const values = [];
    if (filters.role) {
      conditions.push(`role = $${values.length + 1}`);
      values.push(filters.role);
    }
    if (filters.class_id) {
      // join with students
      query = 'SELECT u.id, u.email, u.role, u.first_name, u.last_name, u.avatar_url, u.is_blocked, u.created_at FROM users u JOIN students s ON u.id = s.user_id WHERE s.class_id = $1';
      values.push(filters.class_id);
    } else if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    const { rows } = await pool.query(query, values);
    return rows;
  },

  async update(id, fields) {
    const setClause = Object.keys(fields).map((key, idx) => `${key} = $${idx + 2}`).join(', ');
    const values = [id, ...Object.values(fields)];
    const query = `UPDATE users SET ${setClause} WHERE id = $1 RETURNING id, email, role, first_name, last_name, avatar_url`;
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  async delete(id) {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
  },

  async block(id, block = true) {
    await pool.query('UPDATE users SET is_blocked = $1 WHERE id = $2', [block, id]);
  },
};

module.exports = User;
