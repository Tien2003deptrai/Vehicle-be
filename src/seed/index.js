const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// Import các models
const Role = require('../models/Role');
const VehicleHireService = require('../models/VehicleHireService');
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
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Kết nối MongoDB
mongoose.connect('mongodb://localhost:27017/vehicleHireService1', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Connection failed', err));

// Seed dữ liệu
const seedData = async () => {
    try {
        // Xóa tất cả dữ liệu cũ
        await User.deleteMany({});
        await Role.deleteMany({});
        await VehicleHireService.deleteMany({});
        await Vehicle.deleteMany({});
        await Individual.deleteMany({});
        await Business.deleteMany({});
        await ApprovalRequests.deleteMany({});
        await RentalAgreement.deleteMany({});
        await Bill.deleteMany({});
        await Review.deleteMany({});
        await Notification.deleteMany({});
        await Motor.deleteMany({});
        await Car.deleteMany({});
        await Customer.deleteMany({});
        await Admin.deleteMany({});

        // Seed User
        const users = [
            {
                UserID: uuidv4(),
                Name: 'John Doe',
                Email: 'john@example.com',
                Password: await bcrypt.hash('123456', 10), // Mã hóa mật khẩu
                PhoneNumber: '1234567890',
                Nationality: 'US',
            },
            {
                UserID: uuidv4(),
                Name: 'Jane Doe',
                Email: 'jane@example.com',
                Password: await bcrypt.hash('123456', 10), // Mã hóa mật khẩu
                PhoneNumber: '0987654321',
                Nationality: 'UK',
            },
        ];

        await User.insertMany(users);

        // Seed Role
        const roles = [
            { RoleId: uuidv4(), UserId: users[0].UserID, Type: 'CUSTOMER' },
            { RoleId: uuidv4(), UserId: users[1].UserID, Type: 'ADMIN' },
        ];
        await Role.insertMany(roles);

        // Seed VehicleHireService
        const vehicleHireServices = [
            { UserID: users[0].UserID, ServiceType: 'INDIVIDUAL', Bank_name: 'Bank A', Bank_account: '12345678' },
        ];
        await VehicleHireService.insertMany(vehicleHireServices);

        // Seed Vehicle
        const vehicles = [
            { VehicleID: uuidv4(), UserID: users[0].UserID, Category: 'CAR', LicensePlate: '1234-ABC', Status: 'AVAILABILITY', PricePerDay: 100, FuelConsumption: 8, Range: 500, EngineCapacity: 2.0 },
            { VehicleID: uuidv4(), UserID: users[0].UserID, Category: 'MOTOR', LicensePlate: '5678-XYZ', Status: 'RENTED', PricePerDay: 50, FuelConsumption: 3, Range: 200, EngineCapacity: 0.5 },
        ];
        await Vehicle.insertMany(vehicles);

        // Seed Individual
        const individuals = [
            { idvID: uuidv4(), UserID: vehicleHireServices[0].UserID },
        ];
        await Individual.insertMany(individuals);

        // Seed Business
        const businesses = [
            { BsnID: uuidv4(), UserID: vehicleHireServices[0].UserID, Description: 'Car rental services', Business_img: 'business.jpg', Registration_date: new Date(), VAT: 10, Issuing_location: 'US', Date_of_issue: new Date() },
        ];
        await Business.insertMany(businesses);

        // Seed ApprovalRequests
        const approvalRequests = [
            { RequestID: uuidv4(), AdminID: roles[1].UserId, BsnID: businesses[0].BsnID, RequestDay: new Date(), Status: 'PENDING' },
        ];
        await ApprovalRequests.insertMany(approvalRequests);

        // Seed RentalAgreement
        const rentalAgreements = [
            { AgreementID: uuidv4(), VehicleID: vehicles[0].VehicleID, CusID: roles[0].UserId, ServiceID: vehicleHireServices[0].UserID, StartDate: new Date(), EndDate: new Date(), Status: 'ACTIVE', DepositAmount: 500, PaymentMethod: 'ONLINE' },
        ];
        await RentalAgreement.insertMany(rentalAgreements);

        // Seed Bill
        const bills = [
            { BillID: uuidv4(), CusID: roles[0].UserId, AgreementID: rentalAgreements[0].AgreementID, Date: new Date(), Payment_img: 'receipt.jpg', Status: 'PENDING' },
        ];
        await Bill.insertMany(bills);

        // Seed Review
        const reviews = [
            { ReviewID: uuidv4(), CusID: roles[0].UserId, VehicleID: vehicles[0].VehicleID, Rating: 5, Comment: 'Great service!', ReviewDate: new Date() },
        ];
        await Review.insertMany(reviews);

        // Seed Notification
        const notifications = [
            { NotificationID: uuidv4(), SenderID: roles[1].UserId, ReceiverID: roles[0].UserId, Message: 'Your booking is confirmed', NotificationDate: new Date() },
        ];
        await Notification.insertMany(notifications);

        // Seed Motor
        const motors = [
            { MotorID: uuidv4(), VehicleID: vehicles[1].VehicleID, MotorImage: 'motor.jpg' },
        ];
        await Motor.insertMany(motors);

        // Seed Car
        const cars = [
            { CarID: uuidv4(), VehicleID: vehicles[0].VehicleID, CarBrand: 'Toyota', Fuel_type: 'GASOLINE', SeatingCapacity: 5, CarImage: 'car.jpg', ChargingTime: null },
        ];
        await Car.insertMany(cars);

        // Seed Customer
        const customers = [
            { LicenseID: 'CUST12345', UserID: roles[0].UserId, Class: 'B1', Expire: new Date(), Image: 'license.jpg' },
        ];
        await Customer.insertMany(customers);

        // Seed Admin
        const admins = [
            { AdminID: roles[1].UserId, LastLogin: new Date() },
        ];
        await Admin.insertMany(admins);

        console.log('Seed data created successfully!');
    } catch (err) {
        console.error('Error seeding data:', err);
    } finally {
        mongoose.connection.close();
    }
};

// Gọi hàm seed
seedData();
