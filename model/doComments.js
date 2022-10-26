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
        type: String,
        default: 'Pending',
    }
    
});
module.exports = mongoose.model("DoComments",doCommentschema);