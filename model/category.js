const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        //required: true,
    },
    status:String,

    posts: 
        {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'Post'
        }
    
});
module.exports = mongoose.model("Category",categorySchema);