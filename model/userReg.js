const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
    tokens: [{
        token: {
            type: String,
            required: true,
        }
    }]
    
});

//generating tokens
UserSchema.methods.generateAuthToken = async function(){
    try{
        const token = await jwt.sign({_id: this._id.toString()}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token:token})
        await this.save();
        return token;
    }catch(error){
        res.send("The error part" + error);
        console.log("The error part" + error);
    }
}


//converting password into bcrypt hash--->
UserSchema.pre("save",async function(next){
    if(this.isModified("RegPassword")){
        this.RegPassword = await bcrypt.hash(this.RegPassword, 10);
        this.repeatRegPassword = await bcrypt.hash(this.RegPassword, 10);
    }
    next();

})


module.exports = mongoose.model("UserReg",UserSchema);