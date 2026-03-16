const express = require('express');
const router = express.Router();
const { getMe, getAllUsers, getUserById, createUser, updateUser, deleteUser, blockUser, unblockUser } = require('../controllers/user.controller');
const { checkRole } = require('../middleware/auth');

router.get('/me', getMe);
router.get('/', checkRole('admin', 'director', 'head_teacher'), getAllUsers);
router.get('/:id', getUserById);
router.post('/', checkRole('admin'), createUser);
router.put('/:id', updateUser); // user can update own profile, admin can update others
router.delete('/:id', checkRole('admin'), deleteUser);
router.post('/:id/block', checkRole('admin'), blockUser);
router.post('/:id/unblock', checkRole('admin'), unblockUser);

module.exports = router;
