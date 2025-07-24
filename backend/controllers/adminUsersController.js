const AdminUsers = require('../models/adminUsers');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await AdminUsers.authenticate(email, password);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    if (!user.is_active) return res.status(403).json({ error: 'User is deactivated' });
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.register = async (req, res) => {
  const { email, password, role } = req.body;
  try {
    // Only allow registration if requester is admin
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    const existing = await AdminUsers.getByEmail(email);
    if (existing) return res.status(409).json({ error: 'Email already exists' });
    const id = await AdminUsers.create({ email, password, role });
    res.status(201).json({ id });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getAll = async (req, res) => {
  try {
    const users = await AdminUsers.getAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getById = async (req, res) => {
  try {
    const user = await AdminUsers.getById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deactivate = async (req, res) => {
  try {
    const updated = await AdminUsers.deactivate(req.params.id);
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deactivated' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await AdminUsers.delete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const updated = await AdminUsers.updatePassword(req.params.id, newPassword);
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Password updated' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}; 