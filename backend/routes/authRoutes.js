const express = require('express');
const router = express.Router();
const {
  registerDoctor,
  loginDoctor,
  getMe,
  updateProfile,
  changePassword
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerDoctor);
router.post('/login', loginDoctor);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);

module.exports = router;
