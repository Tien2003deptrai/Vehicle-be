const express = require('express');
const {
    getUsers,
    deleteUser,
    getUserRentals,
    getUserPayments,
    getUserReviews,
    deleteReview,
    getDashboardOverview,
    getVehicleHireRequests,
    handleVehicleHireRequest,
} = require('../controllers/adminController');
const authenticate = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/roleMiddleware');

const router = express.Router();

router.get('/users', authenticate, authorize(['ADMIN']), getUsers);
router.delete('/user/:id', authenticate, authorize(['ADMIN']), deleteUser);
router.get('/activity/rentals', authenticate, authorize(['ADMIN']), getUserRentals);
router.get('/activity/payments', authenticate, authorize(['ADMIN']), getUserPayments);
router.get('/activity/reviews', authenticate, authorize(['ADMIN']), getUserReviews);
router.delete('/review/:id', authenticate, authorize(['ADMIN']), deleteReview);
router.get('/dashboard', authenticate, authorize(['ADMIN']), getDashboardOverview);
router.get('/vehicle-hire-requests', authenticate, authorize(['ADMIN']), getVehicleHireRequests);
router.patch('/vehicle-hire-requests/:id', authenticate, authorize(['ADMIN']), handleVehicleHireRequest);

module.exports = router;
