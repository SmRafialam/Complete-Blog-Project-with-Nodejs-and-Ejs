const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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

UserSchema.pre("save",async function(next){
    if(this.isModified("RegPassword")){
        this.RegPassword = await bcrypt.hash(this.RegPassword, 10);
        console.log(`The current password is ${this.RegPassword}`);

        this.repeatRegPassword = undefined;
    }
    next();

})


module.exports = mongoose.model("UserReg",UserSchema);