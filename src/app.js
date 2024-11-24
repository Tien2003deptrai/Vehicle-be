require("dotenv").config();
const express = require("express");
const authRoutes = require("./routes/authRoutes");
const cusRoutes = require("./routes/customerRoutes");
const adminRoutes = require("./routes/adminRoutes");
const serviceProvider = require("./routes/serviceProviderRoutes");
const systemRoutes = require("./routes/systemRoutes");
const connectDB = require("./config/db");
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();
// Middleware
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/customer", cusRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/service-provider", serviceProvider);
app.use("/api/system", systemRoutes);

// Khởi động server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
