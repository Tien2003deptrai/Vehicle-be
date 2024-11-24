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
        const { VehicleID, Category, LicensePlate, PricePerDay, FuelConsumption, Range, EngineCapacity } = req.body;

        const userService = await VehicleHireService.findOne({ UserID: req.user.UserID });
        if (!userService) {
            return res.status(400).json({ message: 'Bạn chưa đăng ký dịch vụ thuê xe' });
        }

        if (!['INDIVIDUAL', 'BUSINESS'].includes(userService.ServiceType.toUpperCase())) {
            return res.status(403).json({ message: 'Chỉ tài khoản INDIVIDUAL hoặc BUSINESS mới được thêm phương tiện' });
        }

        const newVehicle = new Vehicle({
            VehicleID: VehicleID || require('crypto').randomUUID(),
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
        const { id } = req.params;
        const updates = req.body;

        const vehicle = await Vehicle.findOne({ _id: id, UserID: req.user.UserID });
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

const confirmPayment = async (req, res) => {
    try {
        const { id } = req.params;

        if (req.user.Role !== 'ADMIN' && req.user.UserID !== req.body.ServiceID) {
            return res.status(403).json({ message: 'Bạn không có quyền xác nhận thanh toán' });
        }

        const updatedBill = await Bill.findOneAndUpdate(
            { _id: id },
            { Status: 'COMPLETED' },
            { new: true }
        );

        if (!updatedBill) {
            return res.status(404).json({ message: 'Không tìm thấy hóa đơn' });
        }

        res.status(200).json({ message: 'Xác nhận thanh toán thành công', bill: updatedBill });
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

const payBill = async (req, res) => {
    try {
        const { BillID } = req.body;

        // Lấy thông tin hóa đơn từ BillID
        const bill = await Bill.findOne({ BillID, CusID: req.user.UserID });
        if (!bill) {
            return res.status(404).json({ message: 'Không tìm thấy hóa đơn hoặc bạn không có quyền truy cập' });
        }

        if (bill.Status === 'COMPLETED') {
            return res.status(400).json({ message: 'Hóa đơn này đã được thanh toán' });
        }

        // Cập nhật trạng thái hóa đơn
        bill.Status = 'COMPLETED';
        await bill.save();

        // Gửi thông báo xác nhận (tùy chọn)
        const notification = new Notification({
            NotificationID: require('crypto').randomUUID(),
            SenderID: 'SYSTEM',
            ReceiverID: req.user.UserID,
            Message: `Hóa đơn ${BillID} đã được thanh toán thành công.`,
            NotificationDate: new Date(),
        });
        await notification.save();

        res.status(200).json({ message: 'Thanh toán thành công', bill });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    registerVehicleHireService,
    addNewVehicle,
    updateVehicle,
    confirmPayment,
    extendRentalContract,
    getRentalSchedule,
    payBill
}