const express = require('express');
const { getAllVehicles, getVehicleById } = require('../controllers/systemController');
const router = express.Router();
// Route: Lấy danh sách tất cả phương tiện
router.get('/vehicles', getAllVehicles);

// Route: Lấy thông tin chi tiết phương tiện theo ID
router.get('/vehicles/:id', getVehicleById);

module.exports = router;
