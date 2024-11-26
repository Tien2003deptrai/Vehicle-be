const express = require('express');
const {
    registerVehicleHireService,
    addNewVehicle,
    updateVehicle,
    confirmPayment,
    extendRentalContract,
    getRentalSchedule,
} = require('../controllers/serviceProviderController');
const authenticate = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/register-vehicle', authenticate, registerVehicleHireService);
router.post('/vehicle/add', authenticate, addNewVehicle);
router.patch('/vehicle/update/:VehicleID', authenticate, updateVehicle);
router.patch('/rental/extend/:id', authenticate, extendRentalContract);
router.get('/rental/schedule', authenticate, getRentalSchedule);

module.exports = router;
