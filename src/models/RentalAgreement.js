const mongoose = require('mongoose');

const rentalAgreementSchema = new mongoose.Schema({
    AgreementID: { type: String, required: true, unique: true },
    VehicleID: { type: String, required: true, ref: 'Vehicle' },
    CusID: { type: String, required: true, ref: 'Customer' },
    ServiceID: { type: String, required: true, ref: 'VehicleHireService' },
    StartDate: { type: Date, required: true },
    EndDate: { type: Date, required: true },
    Status: {
        type: String,
        enum: ['ACTIVE', 'COMPLETED', 'CANCELLED'],
        default: 'ACTIVE'
    },
    DepositAmount: { type: Number, required: true },
    PaymentMethod: {
        type: String,
        enum: ['CASH', 'ONLINE'],
        required: true
    }
});

const RentalAgreement = mongoose.model('RentalAgreement', rentalAgreementSchema);

module.exports = RentalAgreement;
