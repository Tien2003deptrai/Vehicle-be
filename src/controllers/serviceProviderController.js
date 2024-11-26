const Bill = require('../models/Bill');
const Customer = require('../models/Customer');
const Notification = require('../models/Notification');
const RentalAgreement = require('../models/RentalAgreement');
const Review = require('../models/Review');
const Vehicle = require('../models/Vehicle');
const VehicleHireService = require('../models/VehicleHireService');

const registerVehicleHireService = async (req, res) => {
    try {
        const { ServiceType, Bank_name, Bank_account } = req.body;

        const existingService = await VehicleHireService.findOne({ UserID: req.user.UserID });
        if (existingService) {
            return res.status(400).json({ message: 'Dịch vụ đã được đăng ký' });
        }

        const newService = new VehicleHireService({
            UserID: req.user.UserID,
            ServiceType: ServiceType,
            Bank_name,
            Bank_account,
        });

        await newService.save();
        res.status(201).json({ message: 'Đăng ký dịch vụ thành công', service: newService });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const addNewVehicle = async (req, res) => {
    try {
        const { Category, LicensePlate, PricePerDay, FuelConsumption, Range, EngineCapacity } = req.body;
        console.log('UserId', req.user.UserID);

        const userService = await VehicleHireService.findOne({ UserID: req.user.UserID });
        if (!userService) {
            return res.status(400).json({ message: 'Bạn chưa đăng ký dịch vụ thuê xe' });
        }

        if (!['INDIVIDUAL', 'BUSINESS'].includes(userService.ServiceType.toUpperCase())) {
            return res.status(403).json({ message: 'Chỉ tài khoản INDIVIDUAL hoặc BUSINESS mới được thêm phương tiện' });
        }

        const newVehicle = new Vehicle({
            VehicleID: require('crypto').randomUUID(),
            UserID: req.user.UserID,
            Category: Category.toUpperCase(),
            LicensePlate,
            Status: 'AVAILABILITY',
            PricePerDay,
            FuelConsumption,
            Range,
            EngineCapacity,
        });

        await newVehicle.save();
        res.status(201).json({ message: 'Thêm xe thành công', vehicle: newVehicle });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


const updateVehicle = async (req, res) => {
    try {
        const { VehicleID } = req.params;
        const updates = req.body;

        const vehicle = await Vehicle.findOne({ VehicleID: VehicleID, UserID: req.user.UserID });
        if (!vehicle) {
            return res.status(404).json({ message: 'Không tìm thấy xe hoặc không có quyền chỉnh sửa' });
        }

        if (vehicle.Status === 'RENTED') {
            return res.status(403).json({ message: 'Không thể cập nhật phương tiện đang được thuê' });
        }

        Object.assign(vehicle, updates);
        await vehicle.save();

        res.status(200).json({ message: 'Cập nhật xe thành công', vehicle });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const extendRentalContract = async (req, res) => {
    try {
        const { id } = req.params;
        const { newEndDate } = req.body;

        const updatedAgreement = await RentalAgreement.findOneAndUpdate(
            { _id: id, ServiceID: req.user.UserID },
            { EndDate: newEndDate },
            { new: true }
        );

        if (!updatedAgreement) {
            return res.status(404).json({ message: 'Không tìm thấy hợp đồng hoặc không có quyền gia hạn' });
        }

        res.status(200).json({ message: 'Gia hạn hợp đồng thành công', agreement: updatedAgreement });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getRentalSchedule = async (req, res) => {
    try {
        const agreements = await RentalAgreement.find({ ServiceID: req.user.UserID }).populate('VehicleID');
        res.status(200).json(agreements);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    registerVehicleHireService,
    addNewVehicle,
    updateVehicle,
    extendRentalContract,
    getRentalSchedule,
}