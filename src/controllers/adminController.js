const User = require('../models/User');
const Role = require('../models/Role');
const Vehicle = require('../models/Vehicle');
const Individual = require('../models/Individual');
const Business = require('../models/Business');
const ApprovalRequests = require('../models/ApprovalRequests');
const RentalAgreement = require('../models/RentalAgreement');
const Bill = require('../models/Bill');
const Review = require('../models/Review');
const Notification = require('../models/Notification');
const Motor = require('../models/Motor');
const Car = require('../models/Car');
const Customer = require('../models/Customer');
const Admin = require('../models/Admin');
const VehicleHireService = require('../models/VehicleHireService');

const getUsers = async (req, res) => {
    try {
        if (req.user.Role !== 'ADMIN') {
            return res.status(403).json({ message: 'Bạn không có quyền truy cập' });
        }

        const { page = 1, limit = 10 } = req.query;
        const users = await User.find({}, '-Password')
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const totalUsers = await User.countDocuments();

        res.status(200).json({
            users,
            pagination: {
                total: totalUsers,
                page: Number(page),
                pages: Math.ceil(totalUsers / limit),
            },
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE /admin/user/:id
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findOneAndDelete({ UserID: id });
        if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

        // Xóa dữ liệu liên quan
        await Customer.deleteMany({ UserID: id });
        await RentalAgreement.deleteMany({ CusID: id });
        await Vehicle.updateMany({ UserID: id }, { $unset: { UserID: '' } }); // Gỡ bỏ quyền sở hữu phương tiện

        res.status(200).json({ message: 'Xóa tài khoản người dùng và dữ liệu liên quan thành công' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getUserRentals = async (req, res) => {
    try {
        if (req.user.Role !== 'ADMIN') {
            return res.status(403).json({ message: 'Bạn không có quyền truy cập' });
        }

        const { page = 1, limit = 10 } = req.query;
        const rentals = await RentalAgreement.find({})
            .populate('VehicleID CusID ServiceID')
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const totalRentals = await RentalAgreement.countDocuments();

        res.status(200).json({
            rentals,
            pagination: {
                total: totalRentals,
                page: Number(page),
                pages: Math.ceil(totalRentals / limit),
            },
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// GET /admin/activity/payments
const getUserPayments = async (req, res) => {
    try {
        const payments = await Bill.find({});
        res.status(200).json(payments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /admin/activity/reviews
const getUserReviews = async (req, res) => {
    try {
        const reviews = await Review.find({}).populate('CusID VehicleID');
        res.status(200).json(reviews);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;

        const review = await Review.findByIdAndDelete(id);
        if (!review) return res.status(404).json({ message: 'Không tìm thấy đánh giá' });

        res.status(200).json({ message: 'Xóa đánh giá thành công' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /admin/dashboard
const getDashboardOverview = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalVehicles = await Vehicle.countDocuments();
        const availableVehicles = await Vehicle.countDocuments({ Status: 'AVAILABILITY' });
        const totalRentals = await RentalAgreement.countDocuments();
        const pendingRequests = await ApprovalRequests.countDocuments({ Status: 'PENDING' });
        const totalPayments = await Bill.countDocuments();

        res.status(200).json({
            totalUsers,
            totalVehicles,
            availableVehicles,
            totalRentals,
            pendingRequests,
            totalPayments,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /admin/vehicle-hire-requests
const getVehicleHireRequests = async (req, res) => {
    try {
        const requests = await ApprovalRequests.find({}).populate('AdminID BsnID');
        res.status(200).json(requests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PATCH /admin/vehicle-hire-requests/:id
const handleVehicleHireRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { Status } = req.body;

        if (!['PENDING', 'ACCEPT', 'REJECT'].includes(Status.toUpperCase())) {
            return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
        }

        const updatedRequest = await ApprovalRequests.findByIdAndUpdate(
            id,
            { Status: Status.toUpperCase() },
            { new: true }
        );

        if (!updatedRequest) {
            return res.status(404).json({ message: 'Không tìm thấy yêu cầu' });
        }

        // Nếu chấp nhận, cập nhật VehicleHireService
        if (Status.toUpperCase() === 'ACCEPT') {
            await VehicleHireService.findOneAndUpdate(
                { UserID: updatedRequest.BsnID },
                { $set: { Approved: true } }
            );
        }

        res.status(200).json({ message: 'Cập nhật trạng thái yêu cầu thành công', request: updatedRequest });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


module.exports = {
    getUsers,
    deleteUser,
    getUserRentals,
    getUserPayments,
    getUserReviews,
    deleteReview,
    getDashboardOverview,
    getVehicleHireRequests,
    handleVehicleHireRequest,
};