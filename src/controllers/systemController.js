const Car = require("../models/Car");
const Motor = require("../models/Motor");
const Vehicle = require("../models/Vehicle");

const getAllVehicles = async (req, res) => {
    try {
        // Lấy tất cả phương tiện từ bảng Vehicle
        const vehicles = await Vehicle.find();

        // Gắn thông tin chi tiết từng phương tiện (Car hoặc Motor)
        const detailedVehicles = await Promise.all(
            vehicles.map(async (vehicle) => {
                let details = null;

                if (vehicle.Category === 'CAR') {
                    details = await Car.findOne({ VehicleID: vehicle.VehicleID });
                } else if (vehicle.Category === 'MOTOR') {
                    details = await Motor.findOne({ VehicleID: vehicle.VehicleID });
                }

                return {
                    ...vehicle.toObject(),
                    details,
                };
            })
        );

        res.status(200).json({
            message: "Lấy danh sách phương tiện thành công",
            vehicles: detailedVehicles,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getVehicleById = async (req, res) => {
    try {
        const { id } = req.params;

        // Lấy phương tiện dựa trên VehicleID
        const vehicle = await Vehicle.findOne({ VehicleID: id }).populate('UserID', 'Name Email');
        if (!vehicle) {
            return res.status(404).json({ message: "Không tìm thấy phương tiện" });
        }

        // Lấy thông tin chi tiết của phương tiện
        let details = null;
        if (vehicle.Category === 'CAR') {
            details = await Car.findOne({ VehicleID: id });
        } else if (vehicle.Category === 'MOTOR') {
            details = await Motor.findOne({ VehicleID: id });
        }

        // Kết hợp dữ liệu và trả về
        res.status(200).json({
            message: "Lấy thông tin phương tiện thành công",
            vehicle: {
                ...vehicle.toObject(),
                details, // Gắn thông tin chi tiết phương tiện
            },
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getAllVehicles,
    getVehicleById
}