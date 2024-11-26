const mongoose = require('mongoose');

// Schema for Review
const reviewSchema = new mongoose.Schema({
    ReviewID: {
        type: String,
        required: true,
        unique: true,
    },
    CusID: {
        type: mongoose.Schema.Types.ObjectId,
        // type: String,
        required: true,
        ref: 'Customer', // Tham chiếu đến model Customer
    },
    VehicleID: {
        type: mongoose.Schema.Types.ObjectId,
        // type: String,
        required: true,
        ref: 'Vehicle', // Tham chiếu đến model Vehicle
    },
    Rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5, // Giá trị đánh giá từ 1 đến 5 sao
    },
    Comment: {
        type: String,
        required: true,
        maxlength: 200, // Giới hạn tối đa 200 ký tự cho bình luận
    },
    ReviewDate: {
        type: Date,
        required: true,
        default: Date.now, // Mặc định là ngày hiện tại
    },
});

// Model
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
