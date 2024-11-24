const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    UserID: { type: String, required: true, unique: true },
    Name: { type: String, required: true },
    Email: { type: String, unique: true, required: true },
    Password: { type: String, required: true },
    PhoneNumber: { type: String, unique: true },
    Nationality: { type: String }
});

userSchema.pre('save', async function (next) {
    try {
        if (!this.isModified('Password')) return next();

        const salt = await bcrypt.genSalt(10);
        this.Password = await bcrypt.hash(this.Password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.Password);
    } catch (error) {
        throw new Error("Error comparing passwords");
    }
};

const User = mongoose.model('User', userSchema);

module.exports = User;
