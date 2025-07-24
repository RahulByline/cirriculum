const pool = require('../config/db');

const AdminSettings = {
  async getById(id) {
    const [rows] = await pool.query('SELECT * FROM admin_settings WHERE id = ?', [id]);
    return rows[0] || null;
  },
  async getByType(setting_type) {
    const [rows] = await pool.query('SELECT * FROM admin_settings WHERE setting_type = ?', [setting_type]);
    return rows;
  },
  async create({ id, setting_type, setting_value }) {
    const [result] = await pool.query(
      'INSERT INTO admin_settings (id, setting_type, setting_value) VALUES (?, ?, ?)',
      [id, setting_type, JSON.stringify(setting_value)]
    );
    return result.insertId;
  },
  async update(id, setting_value) {
    const [result] = await pool.query(
      'UPDATE admin_settings SET setting_value = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [JSON.stringify(setting_value), id]
    );
    return result.affectedRows > 0;
  },
  async delete(id) {
    const [result] = await pool.query('DELETE FROM admin_settings WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
};

module.exports = AdminSettings; 