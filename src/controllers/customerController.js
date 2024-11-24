const Bill = require('../models/Bill');
const Customer = require('../models/Customer');
const Notification = require('../models/Notification');
const RentalAgreement = require('../models/RentalAgreement');
const Review = require('../models/Review');
const Vehicle = require('../models/Vehicle');
const VehicleHireService = require('../models/VehicleHireService');

// GET /vehicles/search
const searchRentalVehicles = async (req, res) => {
    try {
        const { Category, MinPrice, MaxPrice } = req.query;

        const filters = { Status: 'AVAILABILITY' };

        if (Category) filters.Category = Category.toUpperCase();
        if (MinPrice) filters.PricePerDay = { $gte: Number(MinPrice) };
        if (MaxPrice) filters.PricePerDay = { ...filters.PricePerDay, $lte: Number(MaxPrice) };

        const vehicles = await Vehicle.find(filters);
        res.status(200).json(vehicles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const bookVehicle = async (req, res) => {
    try {
        const { VehicleID, StartDate, EndDate, DepositAmount, PaymentMethod } = req.body;

        // Lấy CusID từ bảng Customer
        const customer = await Customer.findOne({ UserID: req.user.UserID });
        if (!customer) {
            return res.status(404).json({ message: 'Không tìm thấy thông tin khách hàng' });
        }

        const vehicle = await Vehicle.findOne({ VehicleID, Status: 'AVAILABILITY' });
        if (!vehicle) {
            return res.status(400).json({ message: 'Xe không khả dụng' });
        }

        const agreement = new RentalAgreement({
            AgreementID: require('crypto').randomUUID(),
            VehicleID,
            CusID: customer.LicenseID,
            ServiceID: vehicle.UserID,
            StartDate,
            EndDate,
            Status: 'ACTIVE',
            DepositAmount,
            PaymentMethod: PaymentMethod.toUpperCase(),
        });

        await agreement.save();

        vehicle.Status = 'RENTED';
        await vehicle.save();

        res.status(201).json({ message: 'Đặt xe thành công', agreement });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const rateAndReview = async (req, res) => {
    try {
        const { VehicleID, Rating, Comment } = req.body;

        const customer = await Customer.findOne({ UserID: req.user.UserID });
        if (!customer) {
            return res.status(404).json({ message: 'Không tìm thấy thông tin khách hàng' });
        }

        const agreement = await RentalAgreement.findOne({ VehicleID, CusID: customer.LicenseID, Status: 'COMPLETED' });
        if (!agreement) {
            return res.status(400).json({ message: 'Bạn chưa sử dụng dịch vụ này để đánh giá' });
        }

        if (Rating < 1 || Rating > 5) {
            return res.status(400).json({ message: 'Xếp hạng phải từ 1 đến 5' });
        }

        const review = new Review({
            ReviewID: require('crypto').randomUUID(),
            CusID: customer.LicenseID,
            VehicleID,
            Rating,
            Comment,
            ReviewDate: new Date(),
        });

        await review.save();

        res.status(201).json({ message: 'Đánh giá thành công', review });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getNotifications = async (req, res) => {
    try {
        // Lấy CusID từ JWT
        const ReceiverID = req.user.UserID;

        const notifications = await Notification.find({ ReceiverID });
        res.status(200).json(notifications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const viewTransactionHistory = async (req, res) => {
    try {
        const UserID = req.user.UserID;

        const transactions = await Bill.find({ CusID: UserID });
        res.status(200).json(transactions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const createBill = async (agreementId, customerId) => {
    try {
        // Lấy thông tin hợp đồng
        const agreement = await RentalAgreement.findOne({ AgreementID: agreementId });
        if (!agreement) {
            throw new Error('Hợp đồng không tồn tại');
        }

        // Tạo hóa đơn mới
        const newBill = new Bill({
            BillID: uuidv4(),
            CusID: customerId,
            AgreementID: agreementId,
            Date: new Date(),
            Payment_img: '', // Để trống ban đầu, cập nhật sau khi thanh toán
            Status: 'PENDING',
        });

        await newBill.save();
        console.log(`Hóa đơn cho hợp đồng ${agreementId} đã được tạo.`);
    } catch (err) {
        console.error('Error creating bill:', err.message);
    }
};

const payBill = async (req, res) => {
    try {
        const { BillID } = req.body;

        // Lấy hóa đơn từ BillID
        const bill = await Bill.findOne({ BillID, CusID: req.user.UserID });
        if (!bill) {
            return res.status(404).json({ message: 'Không tìm thấy hóa đơn hoặc bạn không có quyền truy cập' });
        }

        if (bill.Status === 'COMPLETED') {
            return res.status(400).json({ message: 'Hóa đơn này đã được thanh toán' });
        }

        // Cập nhật trạng thái hóa đơn
        bill.Status = 'COMPLETED';
        bill.Payment_img = 'payment-receipt.jpg'; // Cập nhật hình ảnh minh chứng thanh toán
        await bill.save();

        // Gửi thông báo xác nhận thanh toán
        const notification = new Notification({
            NotificationID: uuidv4(),
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
    searchRentalVehicles,
    bookVehicle,
    rateAndReview,
    getNotifications,
    viewTransactionHistory,
    createBill,
    payBill
}