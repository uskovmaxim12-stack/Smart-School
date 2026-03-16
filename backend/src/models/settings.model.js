const pool = require('../config/db');

const Settings = {
  async get(key) {
    const { rows } = await pool.query('SELECT value FROM system_settings WHERE key = $1', [key]);
    return rows[0]?.value;
  },

  async set(key, value) {
    await pool.query(`
      INSERT INTO system_settings (key, value) VALUES ($1, $2)
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
    `, [key, value]);
  },

  async getAll() {
    const { rows } = await pool.query('SELECT key, value FROM system_settings');
    const settings = {};
    rows.forEach(row => settings[row.key] = row.value);
    return settings;
  },
};

module.exports = Settings;
