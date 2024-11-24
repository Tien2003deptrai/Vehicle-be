const jwt = require("jsonwebtoken");

const JWT_SECRET = "your_jwt_secret_key"; // Đảm bảo secret key này giống với file generateToken.js

const authenticate = (req, res, next) => {
    try {
        // Lấy token từ header Authorization
        const authHeader = req.header("Authorization");
        if (!authHeader) {
            return res.status(401).json({ message: "Access Denied: No Token Provided" });
        }

        // Tách token nếu header chứa Bearer
        const token = authHeader.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : authHeader;

        // Xác minh token
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Gắn thông tin UserID và Role vào req
        console.log("Decoded user:", req.user);

        next();
    } catch (err) {
        console.error("Token verification error:", err);
        return res.status(400).json({ message: "Invalid Token" });
    }
};

module.exports = authenticate;
