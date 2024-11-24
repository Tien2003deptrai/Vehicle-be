const JWT_SECRET = "your_jwt_secret_key";
const JWT_EXPIRES_IN = "7d";
const jwt = require("jsonwebtoken");

const generateToken = (user) => {
    return jwt.sign(
        { UserID: user.UserID, Role: user.Role }, // Bao gồm cả Role trong payload
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
};

module.exports = generateToken;