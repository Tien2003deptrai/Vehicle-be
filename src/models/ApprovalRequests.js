const mongoose = require("mongoose");

const approvalRequestSchema = new mongoose.Schema({
    RequestID: { type: String, required: true, unique: true },
    AdminID: {
        type: mongoose.Schema.Types.ObjectId,
        //  type: String, 
        required: true, ref: 'Admin'
    },
    BsnID: {
        type: mongoose.Schema.Types.ObjectId,
        // type: String,
        required: true, unique: true, ref: 'Business'
    },
    RequestDay: { type: Date },
    Status: {
        type: String,
        enum: ['PENDING', 'ACCEPT', 'REJECT']
    }
});

const ApprovalRequest = mongoose.model('ApprovalRequest', approvalRequestSchema);

module.exports = ApprovalRequest;
