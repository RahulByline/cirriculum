const express = require('express');
const router = express.Router();
const adminSettingsController = require('../controllers/adminSettingsController');
const { authenticateJWT } = require('../middleware/auth');

// Get all settings by type
router.get('/type/:type', adminSettingsController.getByType);
// Get a setting by id
router.get('/:id', adminSettingsController.getById);
// Create a new setting (admin only)
router.post('/', authenticateJWT, adminSettingsController.create);
// Update a setting (admin only)
router.put('/:id', authenticateJWT, adminSettingsController.update);
// Delete a setting (admin only)
router.delete('/:id', authenticateJWT, adminSettingsController.delete);

module.exports = router; 