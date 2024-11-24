const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    RoleId: { type: String, required: true, unique: true },
    UserId: { type: String, required: true, ref: 'User' },
    Type: {
        type: String,
        required: true,
        enum: ['ADMIN', 'CUSTOMER', 'SERVICE']
    }
});

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;
