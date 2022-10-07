const mongoose = require('mongoose');
var MONGO_URI = 'mongodb+srv://demoPruvit2:demoPruvit2@cluster0.r0yxtet.mongodb.net/?retryWrites=true&w=majority'


const connectDB = async()=>{
    try{
        //mongoDB connection string
        const con = await mongoose.connect(MONGO_URI,{
            useNewUrlParser : true,
            useUnifiedTopology : true,
            
        })
        console.log(`MongoDB connected: ${con.connection.host}`);
 
    }catch(err){
        console.log(err);
        process.exit(1);
    }
}
module.exports = connectDB