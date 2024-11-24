const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/vehicleHireService1', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection error:", error.message);
        process.exit(1); // Dừng server nếu kết nối lỗi
    }
};

module.exports = connectDB;
