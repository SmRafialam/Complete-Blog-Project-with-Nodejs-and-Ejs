const express = require('express');
const router = express.Router();
const User = require('../model/model');
const multer = require('multer');
const fs = require('fs');

//image upload
var storage  = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./static/uploads');
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
        image: req.file.filename,
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
    User.find().exec((err,users)=>{
        if(err){
            res.send("Something went wrong");
        } else{
            res.render("user/home", {users:users});

        }
    });
});

router.get('/admin/dashboard',function(req,res){
    res.render("admin/dashboard");
});

router.get('/admin/addposts',function(req,res){
    res.render("admin/addposts", { title:"Add Posts" });
});
router.get('/admin/postlists',function(req,res){
        User.find().exec((err,users)=>{
            if(err){
                res.send("Something went wrong");
            } else{
                res.render("admin/postlists", { title:"Add Lists", users:users, });

            }
        });
});

router.get('/admin/addpostdetails',function(req,res){
    res.render("admin/addpostdetails");
});

router.get('/blogdetails',function(req,res){
    User.find().exec((err,users)=>{
        if(err){
            res.send("Something went wrong");
        } else{
            res.render("user/blogdetails", { users:users, });

        }
    });
});


//edit an user route
router.get('/update-user/:id',function(req,res){
    let id = req.params.id;
    User.findById(id, (err,user)=>{
        if(err){
            res.redirect("/admin/postlists");
        }else{
                res.render("admin/update_user",{
                    title: "Update user",
                    user:user,

                })
            }
        
    })
});
//update an user route
router.post('/update_user/:id',upload,function(req,res){
    let id = req.params.id;
    let new_image = "";
    if(req.file){
        new_image = req.file.filename;
        try{
            fs.unlinkSync('./uploads/'+req.body.old_image);
        }catch(err){
            console.log(err);
        }
    }else{
        new_image = req.body.old_image;
    }


    User.findByIdAndUpdate(id, {
        title: req.body.title,
        content: req.body.content,
        shortDescription: req.body.shortDescription,
        image: new_image,
        status: req.body.status,
    },
    (err,result)=>{
        if(err){
            res.json({message: err.message, type: 'danger'});

        }else{
            req.message={
                type: "success",
                message: "User added successfully",
            };
            res.redirect('/admin/postlists');
        }
    });
});

//Delete an user route
router.get('/delete-user/:id',(req,res)=>{
    let id = req.params.id;
    User.findByIdAndRemove(id,(err,result)=>{
        if(result.image!=''){
            try{
                fs.unlinkSync('./uploads/'+result.image);
            }catch(err){
                console.log(err);
            }
        }
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
})

//add category route
router.get('/admin/addcategory',function(req,res){
    res.render("admin/addcategory", { title:"Add Category" });
});

module.exports = router;