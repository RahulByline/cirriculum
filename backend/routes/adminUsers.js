const express = require('express');
const router = express.Router();
const adminUsersController = require('../controllers/adminUsersController');
const { authenticateJWT } = require('../middleware/auth');

// Admin login
router.post('/login', adminUsersController.login);
// Admin registration (protected, only existing admin can create new admin)
router.post('/register', authenticateJWT, adminUsersController.register);
// Get all admins (protected)
router.get('/', authenticateJWT, adminUsersController.getAll);
// Get admin by id (protected)
router.get('/:id', authenticateJWT, adminUsersController.getById);
// Deactivate admin (protected)
router.put('/:id/deactivate', authenticateJWT, adminUsersController.deactivate);
// Delete admin (protected)
router.delete('/:id', authenticateJWT, adminUsersController.delete);
// Update password (protected)
router.put('/:id/password', authenticateJWT, adminUsersController.updatePassword);

module.exports = router; 