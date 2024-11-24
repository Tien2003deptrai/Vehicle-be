const mongoose = require('mongoose');

// Schema for Bill
const billSchema = new mongoose.Schema({
    BillID: {
        type: String,
        required: true,
        unique: true
    },
    CusID: {
        type: String,
        required: true,
        ref: 'Customer'
    }, // Tham chiếu đến Customer
    AgreementID: {
        type: String,
        required: true,
        ref: 'RentalAgreement'
    }, // Tham chiếu đến RentalAgreement
    Date: {
        type: Date,
        required: true,
        default: Date.now
    },
    Payment_img: {
        type: String,
        required: true
    }, // Link hoặc đường dẫn đến hình ảnh thanh toán
    Status: {
        type: String,
        required: true,
        enum: ['PENDING', 'COMPLETED', 'CANCELLED'],
        default: 'PENDING'
    } // Trạng thái hóa đơn
});

// Model
const Bill = mongoose.model('Bill', billSchema);

module.exports = Bill;
