const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const {
  login,
  signup,
  adminLogin,
  getMe,
  updateProfile,
  deleteAccount,
} = require('../controllers/authController');

const router = express.Router();

router.post('/login', asyncHandler(login));
router.post('/signup', asyncHandler(signup));
router.post('/admin-login', asyncHandler(adminLogin));
router.get('/me', asyncHandler(getMe));
router.put('/profile', asyncHandler(updateProfile));
router.delete('/account', asyncHandler(deleteAccount));

module.exports = router;
