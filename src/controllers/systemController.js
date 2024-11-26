const Car = require("../models/Car");
const Motor = require("../models/Motor");
const Review = require("../models/Review");
const Vehicle = require("../models/Vehicle");

const getAllVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find();

        const detailedVehicles = await Promise.all(
            vehicles.map(async (vehicle) => {
                let details = null;

                if (vehicle.Category === 'CAR') {
                    details = await Car.findOne({ VehicleID: vehicle.VehicleID });
                } else if (vehicle.Category === 'MOTOR') {
                    details = await Motor.findOne({ VehicleID: vehicle.VehicleID });
                }

                const reviews = await Review.find({ VehicleID: vehicle.VehicleID });

                return {
                    ...vehicle.toObject(),
                    details,
                    reviews,
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

        const vehicle = await Vehicle.findOne({ VehicleID: id });
        if (!vehicle) {
            return res.status(404).json({ message: "Không tìm thấy phương tiện" });
        }

        let details = null;
        if (vehicle.Category === "CAR") {
            details = await Car.findOne({ VehicleID: id });
            if (!details) {
                return res
                    .status(404)
                    .json({ message: "Không tìm thấy thông tin chi tiết của xe hơi" });
            }
        } else if (vehicle.Category === "MOTOR") {
            details = await Motor.findOne({ VehicleID: id });
            if (!details) {
                return res
                    .status(404)
                    .json({ message: "Không tìm thấy thông tin chi tiết của xe máy" });
            }
        }
        const reviews = await Review.find({ VehicleID: id });

        return res.status(200).json({
            message: "Lấy thông tin phương tiện thành công",
            vehicle: {
                ...vehicle.toObject(),
                details,
                reviews,
            },
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};


module.exports = {
    getAllVehicles,
    getVehicleById
}