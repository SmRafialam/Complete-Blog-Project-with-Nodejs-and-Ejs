const mongoose = require('mongoose');
const doCommentschema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
   
    status: {
        type: Boolean,
    }
    
});
module.exports = mongoose.model("DoComments",doCommentschema);