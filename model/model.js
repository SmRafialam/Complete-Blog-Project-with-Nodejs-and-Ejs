const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    shortDescription: {
        type: String,
        required: true,
    },
    images: {
        type: String,
        required: true,
    },
    status:String,
});
module.exports = mongoose.model("User",userSchema);