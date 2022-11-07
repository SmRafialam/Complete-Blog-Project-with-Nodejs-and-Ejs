const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: Number,
        required: true,
        unique: true
    },
    RegPassword: {
        type: String,
        required: true,
    },
    repeatRegPassword: {
        type: String,
        required: true,
    },
    
    
});
module.exports = mongoose.model("UserReg",UserSchema);