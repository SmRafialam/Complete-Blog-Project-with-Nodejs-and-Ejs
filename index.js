const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const session = require('express-session');
const fs = require('fs');
const connectDB = require('./server/database/connection'); 
const { urlencoded } = require('express');
const path = require('path');

const PORT = process.env.PORT ||4000;


//mongoDB connection
connectDB();

//middleware
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(
    session({
        secret: "my secret key",
        saveUninitialized: true,
        resave: false,
    })
);
// app.use((req,res,next)=>{
//     res.locals.message = res.session.message;
//     delete req.session.message;
//     next();
// });

app.use('/node_modules/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

//route prefix
app.use("",require("./routes/router"));

// app.use(express.static("uploads"));

app.use("/static",express.static(__dirname + "/static"));



app.set("view engine","ejs");



app.listen(PORT,function(req,res){
    console.log("server successfully run...");
});


