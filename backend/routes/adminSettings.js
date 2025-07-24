const express = require('express');
const router = express.Router();
const adminSettingsController = require('../controllers/adminSettingsController');
const { authenticateJWT } = require('../middleware/auth');

// Get all settings by type
router.get('/type/:type', adminSettingsController.getByType);
// Get a setting by id
router.get('/:id', adminSettingsController.getById);
// Create a new setting (temporarily no auth for migration)
router.post('/', adminSettingsController.create);
// Update a setting (temporarily no auth for migration)
router.put('/:id', adminSettingsController.update);
// Delete a setting (temporarily no auth for migration)
router.delete('/:id', adminSettingsController.delete);

module.exports = router; 