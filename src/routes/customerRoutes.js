const express = require('express');
const {
    searchRentalVehicles,
    bookVehicle,
    rateAndReview,
    getNotifications,
    viewTransactionHistory,
    payBill,
    createBill,
} = require('../controllers/customerController');
const authenticate = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/vehicles/search', authenticate, searchRentalVehicles);
router.post('/rental/book', authenticate, bookVehicle);
router.post('/review', authenticate, rateAndReview);
router.get('/notifications', authenticate, getNotifications);
router.post('/bills', authenticate, createBill);
router.post('/bills/pay', authenticate, payBill);
router.get('/bills', authenticate, viewTransactionHistory);

module.exports = router;
