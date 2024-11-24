const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    NotificationID: { type: String, required: true, unique: true },
    SenderID: { type: String, required: true, ref: 'User' },
    ReceiverID: { type: String, required: true, ref: 'User' },
    Message: { type: String, required: true },
    NotificationDate: { type: Date, required: true }
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
