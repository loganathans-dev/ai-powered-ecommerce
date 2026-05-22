const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const {
  getOrders,
  getUserOrders,
  createOrder,
  updateOrderStatus,
} = require('../controllers/orderController');

const router = express.Router();

router.get('/', asyncHandler(getOrders));
router.get('/user/:email', asyncHandler(getUserOrders));
router.post('/', asyncHandler(createOrder));
router.patch('/:id/status', asyncHandler(updateOrderStatus));

module.exports = router;
