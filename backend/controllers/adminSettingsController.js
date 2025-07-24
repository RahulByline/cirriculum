const AdminSettings = require('../models/adminSettings');

exports.getByType = async (req, res) => {
  try {
    const settings = await AdminSettings.getByType(req.params.type);
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getById = async (req, res) => {
  try {
    const setting = await AdminSettings.getById(req.params.id);
    if (!setting) return res.status(404).json({ error: 'Not found' });
    res.json(setting);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.create = async (req, res) => {
  try {
    const { id, setting_type, setting_value } = req.body;
    await AdminSettings.create({ id, setting_type, setting_value });
    res.status(201).json({ message: 'Created' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.update = async (req, res) => {
  try {
    const { setting_value } = req.body;
    const updated = await AdminSettings.update(req.params.id, setting_value);
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Updated' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await AdminSettings.delete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}; 