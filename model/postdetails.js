const mongoose = require('mongoose');
const postDetailSchema = new mongoose.Schema({
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
    image: {
        type: String,
        //required: true,
    },
    status:String,
    
});
module.exports = mongoose.model("PostDetails",postDetailSchema);