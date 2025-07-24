// NOTE: The admin_users table must have a 'password' column (VARCHAR) for authentication.
const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const AdminUsers = {
  async getByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM admin_users WHERE email = ?', [email]);
    return rows[0] || null;
  },
  async getById(id) {
    const [rows] = await pool.query('SELECT * FROM admin_users WHERE id = ?', [id]);
    return rows[0] || null;
  },
  async create({ email, password, role = 'admin' }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = uuidv4();
    await pool.query(
      'INSERT INTO admin_users (id, email, password, role, is_active) VALUES (?, ?, ?, ?, ?)',
      [id, email, hashedPassword, role, true]
    );
    return id;
  },
  async updatePassword(id, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const [result] = await pool.query('UPDATE admin_users SET password = ? WHERE id = ?', [hashedPassword, id]);
    return result.affectedRows > 0;
  },
  async authenticate(email, password) {
    const user = await this.getByEmail(email);
    if (!user) return null;
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;
    return user;
  },
  async getAll() {
    const [rows] = await pool.query('SELECT id, email, role, is_active, created_at, updated_at FROM admin_users');
    return rows;
  },
  async deactivate(id) {
    const [result] = await pool.query('UPDATE admin_users SET is_active = false WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },
  async delete(id) {
    const [result] = await pool.query('DELETE FROM admin_users WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
};

module.exports = AdminUsers; 