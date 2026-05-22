const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const {
  getKey,
  createPaymentOrder,
  verifyPayment,
} = require('../controllers/paymentController');

const router = express.Router();

router.get('/key', asyncHandler(getKey));
router.post('/create-order', asyncHandler(createPaymentOrder));
router.post('/verify', asyncHandler(verifyPayment));

module.exports = router;
