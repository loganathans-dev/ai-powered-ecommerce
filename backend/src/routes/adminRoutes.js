const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const { getDashboardStats } = require('../controllers/adminController');

const router = express.Router();

router.get('/stats', asyncHandler(getDashboardStats));

module.exports = router;
