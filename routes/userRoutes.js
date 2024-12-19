const express = require('express');
const { registerUser, loginUser, getProfile, getAllProfiles, updateProfile, deleteUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile/:id', protect, getProfile);
router.get('/profiles', protect, getAllProfiles);
router.put('/profile/:id', protect, updateProfile);
router.delete('/profile/:id', protect, deleteUser);

module.exports = router;
