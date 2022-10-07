const express = require('express');
const router = express.Router();
const User = require('../model/model');
const multer = require('multer');
//image upload
var storage  = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./uploads');
    },
    filename: function(req,file,cb){
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    },
});
var upload = multer({
    storage:storage,
}).single("image");

//insert an user into database route
router.post('/addposts',upload,(req,res)=>{
    const userdata = {
        title: req.body.title,
        content: req.body.content,
        shortDescription: req.body.shortDescription,
        image: "test1",
        status: req.body.status,
    }
    console.log(userdata);
    const user = new User(userdata);
    
    user.save((err) => {
        console.log(err);
        if(err){
            res.json({message: err.message, type: 'danger'});

        }else{
            req.message={
                type: "success",
                message: "User added successfully",
            };
            res.redirect('/admin/postlists');
        }
    })
    
});



router.get('/users',function(req,res){
    res.send("All Users");
});

router.get('/',function(req,res){
    res.send("Home Page !");
});

router.get('/admin/dashboard',function(req,res){
    res.render("admin/dashboard");
});

router.get('/admin/addposts',function(req,res){
    res.render("admin/addposts", { title:"Add Posts" });
});
router.get('/admin/postlists',function(req,res){
    res.render("admin/postlists", { title:"Add Lists" });
});

module.exports = router;