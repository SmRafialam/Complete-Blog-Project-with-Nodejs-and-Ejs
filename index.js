const express = require('express');
const app = express();
require('dotenv').config();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const fs = require('fs');
const connectDB = require('./server/database/connection'); 
const path = require('path');
const PORT = process.env.PORT ||4000;
const postRouter = require('./routes/postRouter');
const categoryRouter = require('./routes/categoryRouter');
const postDetailsRouter = require('./routes/postDetailsRouter');

//mongoDB connection
connectDB();

//middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
// app.use(
//     session({
//         key: "admin",
//         secret: "any random string",
        
//     })
// );
app.use(
    session({
        secret: "my secret key",
        saveUninitialized: true,
        resave: false,
    })
);


app.use('/node_modules/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

//route prefix
// app.use("",require("./routes/router"));

// app.use(express.static("uploads"));

app.use("/static",express.static(__dirname + "/static"));

app.use('/posts', postRouter);
app.use('/categories', categoryRouter);
app.use('/postdetails', postDetailsRouter);


app.set("view engine","ejs");



app.listen(PORT,function(req,res){
    console.log("server successfully run...");
});


