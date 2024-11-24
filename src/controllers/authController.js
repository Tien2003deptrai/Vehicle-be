// File authController.js 
const User = require("../models/User");
const generateToken = require("../utils/tokenUtils");
const Role = require("../models/Role");
const Customer = require("../models/Customer");

// Đăng ký người dùng mới
const register = async (req, res) => {
    try {
        const { Name, Email, Password } = req.body;

        // Kiểm tra xem email đã tồn tại chưa
        const existingUser = await User.findOne({ Email });
        if (existingUser) {
            return res.status(400).json({ message: "Email đã tồn tại" });
        }

        // Tạo người dùng mới
        const userId = crypto.randomUUID();
        const newUser = new User({
            UserID: userId,
            Name,
            Email,
            Password,
        });

        await newUser.save();

        // Gán Role mặc định là CUSTOMER
        const roleType = "CUSTOMER"; // Role mặc định là CUSTOMER
        const newRole = new Role({
            RoleId: crypto.randomUUID(),
            UserId: userId,
            Type: roleType,
        });

        await newRole.save();

        // Nếu Role là CUSTOMER, thêm bản ghi vào bảng Customer
        if (roleType === "CUSTOMER") {
            const newCustomer = new Customer({
                LicenseID: crypto.randomUUID(),
                UserID: userId,
                Class: "B1", // Giá trị mặc định, có thể thay đổi sau
                Expire: new Date(), // Ngày hết hạn mặc định
                Image: "default.jpg", // Ảnh mặc định
            });

            await newCustomer.save();
        }

        // Tạo JWT
        const token = generateToken({ UserID: userId, Role: roleType });

        return res.status(201).json({
            message: "Đăng ký thành công",
            token,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Có lỗi xảy ra khi đăng ký" });
    }
};


const login = async (req, res) => {
    try {
        const { Email, Password } = req.body;

        // Tìm người dùng theo email
        const user = await User.findOne({ Email });
        if (!user) {
            return res.status(401).json({ message: "Email hoặc mật khẩu không chính xác" });
        }

        // So sánh mật khẩu
        const isMatch = await user.comparePassword(Password);
        if (!isMatch) {
            return res.status(401).json({ message: "Email hoặc mật khẩu không chính xác" });
        }

        // Lấy Role từ bảng Role
        const userRole = await Role.findOne({ UserId: user.UserID });
        if (!userRole) {
            return res.status(400).json({ message: "Vai trò của người dùng không tồn tại" });
        }

        // Tạo JWT (bao gồm Role)
        const token = generateToken({ UserID: user.UserID, Role: userRole.Type });

        return res.status(200).json({ message: "Đăng nhập thành công", token, user: user });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Có lỗi xảy ra khi đăng nhập" });
    }
};

module.exports = login;

module.exports = { register, login };
