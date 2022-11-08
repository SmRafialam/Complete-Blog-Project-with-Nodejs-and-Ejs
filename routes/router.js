const express = require('express');
const router = express.Router();
const Post = require('../model/model');
const PostDetails = require('../model/postdetails');
const DoComments = require('../model/doComments');
const Category = require('../model/category');
const UserReg = require('../model/userReg');
const multer = require('multer');
const fs = require('fs');
const request = require('request');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');


//Demo Secure Password using BcryptJS-->
// const securePassword = async(password)=>{
//     const passwordHash = await bcrypt.hash(password,10);
//     console.log(passwordHash);

//     const passwordMatch = await bcrypt.compare(password,passwordHash);
//     console.log(passwordMatch);
// }

// securePassword("rafi@123");



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



//admin panel---->
//login-check
router.post('/do-admin-login',async(req,res)=>{


    const email = req.body.email;
    const RegPassword= req.body.RegPassword;

    try{

        const userData = await UserReg.findOne({
            email:email,
        });
        if(userData.RegPassword === RegPassword ){
            
            res.redirect('/admin/dashboard');


        }
        else{
            res.render('admin/login',{message: "email and password is incorrect"});
        }
    }
    catch(err){
        res.send("Invalid login details");
    }            
});

// router.post('/do-admin-login',upload,async(req,res)=>{
//     const doAdminLogin = {
//         email: req.body.email,
//         password: req.body.password,

//     }
//     console.log(doAdminLogin);
//     const doLogin = new Admins(doAdminLogin);
//     doLogin.save((err) => {
//         console.log(err);
//         if(err){
//             res.json({message: err.message, type: 'danger'});

//         }else{
//             req.message={
//                 type: "success",
//                 message: "Added successfully",
//             };
//             res.redirect('/admin/dashboard');
//         }
//     });
// });

router.get("/do-logout",function(req,res){
    req.session.destroy();
    res.redirect("/admin");
})

//Registration Panel---->

router.post('/register',upload,async(req,res)=>{
    const Password = req.body.RegPassword;
    const RepeatPassword = req.body.repeatRegPassword;

  if(Password === RepeatPassword){
    const userRegister = {
        name:req.body.name,
        email:req.body.email,
        phone:req.body.phone,
        RegPassword:req.body.RegPassword,
        repeatRegPassword:req.body.repeatRegPassword,
    }
    
    const registered = new UserReg(userRegister);
    registered.save((err) => {
        console.log(err);
        if(err){
            res.json({message: err.message, type: 'danger'});

        }else{
            req.message={
                type: "success",
                message: "User added successfully",
            };
            res.redirect('/admin');
        }
    });
}else{
    res.send("password not matching");
}
});

//insert an post into database route
router.post('/addposts',upload,async(req,res)=>{
    

    const postdata = {
        title: req.body.title,
        content: req.body.content,
        shortDescription: req.body.shortDescription,
        image: req.file.filename,
        featuredItem: req.body.featuredItem,
        status: req.body.status,
        categories: req.body.catId,

    }
    console.log(postdata);
    const post = new Post(postdata);
    try{
        const postlist = await post.save();
        await Category.updateOne({
            _id : req.catId
        },{
            $push:{
                posts: postlist._id
            }
        });
        req.message={
            type: "success",
            message: "Posts added successfully",
        };
        res.redirect('/admin/postlists');
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
    
    // post.save((err) => {
    //     console.log(err);
    //     if(err){
    //         res.json({message: err.message, type: 'danger'});

    //     }else{
    //         req.message={
    //             type: "success",
    //             message: "post added successfully",
    //         };
    //         res.redirect('/admin/postlists');
    //     }
    // });
    
});

router.get('/posts',function(req,res){
    res.send("All posts");
});

router.get('/categories',function(req,res){
    res.send("All Categories");
});

router.get('/',function(req,res){
    // const limitnumber = 3;
    //     const latest = Post.find({}).sort({_id: -1}).limit(limitnumber);
    //     const posts = { latest };
        Post.find({
            status: 'Active'
        }).exec((err,posts)=>{
        
        posts=posts.reverse();
        if(err){ 
            res.send("Something went wrong");
        } else{
            Category.find({
                status: 'Active'
            }).exec((err,categories)=>{
                if(err){
                    res.send("Something went wrong");
                } else{
                     res.render("user/home", {posts:posts,categories:categories});
        
                }
            });
        }
    });

    
});

router.get('/admin/dashboard',function(req,res){
    // if(req.session.user_id){
        res.render("admin/dashboard");
    // }else{
    //     res.redirect("/admin");
    // }
});

router.get("/admin",function(req,res){
    res.render("admin/login")
});

router.get("/register",function(req,res){
    res.render("admin/register")
});

router.get('/admin/addposts',async(req,res)=>{
    try{
        const categories = await Category.find({});
        console.log(categories);
        res.render("admin/addposts", { title:"Add Posts", categories:categories});
    }
    catch(err){
        res.send("Something went wrong");
    }
    
});
router.get('/admin/postlists',async(req,res)=>{
    try{
        const posts = await Post.find({
            type: "true"
        }).populate("categories");
        res.render("admin/postlists", { title:"Post Lists", posts:posts, });
    }
    catch(err){
        res.send("Something went wrong");

    }
});
//insert an post details into database route
router.post('/addPostDetails',upload,async(req,res)=>{
    const postdetailsdata = {
        title: req.body.title,
        content: req.body.content,
        shortDescription: req.body.shortDescription,
        image: req.file.filename,
        status: req.body.status,
    }
    console.log(postdetailsdata);
    const postdetails = new PostDetails(postdetailsdata);
    postdetails.save((err) => {
        console.log(err);
        if(err){
            res.json({message: err.message, type: 'danger'});

        }else{
            req.message={
                type: "success",
                message: "post Details added successfully",
            };
            res.redirect('/admin/postDetailsLists');
        }
    });
});

//specific query for featured item property
const getFeaturedItem = async()=>{
    try{
        const result = await Post.find({featuredItem: true});
        console.log(result); 
    }
    catch(err){
        console.log(err);
    }
    
}
getFeaturedItem();




//add & show post details route
router.get('/admin/addPostDetails',async(req,res)=>{
    try{
        
        res.render("admin/addPostDetails", { title:"Add Post Details"});
    }
    catch(err){
        res.send("Something went wrong");
    }
});
router.get('/admin/postDetailsLists',async(req,res)=>{
    try{
        const postdetails = await PostDetails.find({});
        const postComments = await DoComments.find({
        });
        res.render("admin/postDetailsLists", { title:"Post Details Lists", postdetails:postdetails, postComments:postComments});
    }
    catch(err){
        res.send("Something went wrong");

    }
});
router.get('/postDetails',async(req,res)=>{
    try{
        const postDetails = await PostDetails.find({});
        const postComments = await DoComments.find({
            status: 'Approved',
        });
        res.render("user/blogdetails", { postDetails:postDetails, postComments:postComments});
    }
    catch(err){
        res.send("Something went wrong");

    }
    

});
//edit post details route
router.get('/update-postDetails/:id',function(req,res){
    let id = req.params.id;
    PostDetails.findById(id, (err,postdetails)=>{
        if(err){
            res.redirect("/admin/postDetailsLists");
        }else{
                res.render("admin/update_postDetails",{
                    title: "Update post Details",
                    postdetails:postdetails,

                })
            }
        
    })
});
//update an post details route
router.post('/update_postDetails/:id',upload,function(req,res){
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


    PostDetails.findByIdAndUpdate(id, {
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
                message: "post details added successfully",
            };
            res.redirect('/admin/postDetailsLists');
        }
    });
});
//Delete an post details route
router.get('/delete-postDetails/:id',(req,res)=>{
    let id = req.params.id;
    PostDetails.findByIdAndRemove(id,(err,result)=>{
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
                message: "post details removed successfully",
            };
            res.redirect('/admin/postDetailsLists');
        }

    });
});

//post comment route
// router.post("/do-comment",function(req,res){
//     PostDetails.collection("posts").
// })



//edit an post route
router.get('/update-post/:id',function(req,res){
    let id = req.params.id;
    Post.findById(id, (err,post)=>{
        if(err){
            res.redirect("/admin/postlists");
        }else{
                res.render("admin/update_post",{
                    title: "Update post",
                    post:post,

                })
            }
        
    })
});
//update an post route
router.post('/update_post/:id',upload,function(req,res){
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


    Post.findByIdAndUpdate(id, {
        title: req.body.title,
        content: req.body.content,
        shortDescription: req.body.shortDescription,
        image: new_image,
        featuredItem: req.body.featuredItem,
        status: req.body.status,
    },
    (err,result)=>{
        if(err){
            res.json({message: err.message, type: 'danger'});

        }else{
            req.message={
                type: "success",
                message: "post added successfully",
            };
            res.redirect('/admin/postlists');
        }
    });
});

//Delete an post route
router.get('/delete-post/:id',(req,res)=>{
    let id = req.params.id;
    Post.findByIdAndRemove(id,(err,result)=>{
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
                message: "post removed successfully",
            };
            res.redirect('/admin/postlists');
        }

    })
})

//POST FOR COMMENT BOX
//----------->
router.post('/doComment',upload,async(req,res)=>{

    
    const doCommentdata = {
        name: req.body.name,
        email: req.body.email,
        comment: req.body.comment,
        status: req.body.status,

    }
    console.log(doCommentdata);
    try{
        const doComments = new DoComments(doCommentdata);

        await doComments.save();
        req.message={
            type: "success",
            message: "post Comments added successfully",
        };
        res.redirect('/postdetails');
    }
    catch(err){
        res.json({message: err.message, type: 'danger'});
    }
    
    
});


// router.get('/doComment/:id',async(req,res)=>{
//     let id = req.params.id;
//     Post.findById(id,{
//         status: 'Approved'
//     }).exec((err,posts)=>{
    
//     posts=posts.reverse();
//         if(err){
//             res.send("Something went wrong");
//         }else{
//                 res.render("/postdetails");
//             }
//         });
 
   
// });

//edit an view comments route
router.get('/view-comments/:id',function(req,res){
    let id = req.params.id;
    DoComments.findById(id, (err,viewComments)=>{
        if(err){
            res.redirect("/admin/postDetailsLists");
        }else{
                res.render("admin/view_comments",{
                    title: "View Comments",
                    viewComments:viewComments,
                })
            }
        
    })
});
//update an view comments route
router.post('/view_comments/:id',upload,function(req,res){
    let id = req.params.id;
    DoComments.findByIdAndUpdate(id,{
        name: req.body.name,
        email: req.body.email,
        comment: req.body.comment,
        status: req.body.status, 
        comment_email: req.body.comment_email,
    },
    async(err,result,document)=>{
        let testAccount = await nodemailer.createTestAccount();
        let transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            server : "gmail",
            auth:{
                "user": testAccount.user,
                "pass": testAccount.pass,
            }
        });
        let mailOptions = {
            "from": "My Blog",
            "to": req.body.comment_email,
            "subject": "New reply",
            "text": req.body.name + "User has replied on your comment.http://localhost:8000/view-comments/" + req.params.id,
        };
        let info = transporter.sendMail(mailOptions,function(req,info){
            if(err){
            res.json({message: err.message, type: 'danger'});

            }else{
                req.message={
                    type: "success",
                    message: "Comments added successfully",
                };
                res.redirect('/admin/postDetailsLists');
            }
            });
            console.log("Message sent: %s", info);
        
    });
});

//post captcha form
router.post('/subscribe',(req,res)=>{
    if(
        req.body.captcha === undefined ||
        req.body.captcha === '' ||
        req.body.captcha === null

    ){
        return res.json({"success":false,"msg":"please select captcha"});
    }

    //secret key
    const secretKey = '6LeODrQiAAAAAJjJmF8tmqQZmRCZhGIvAL60OAP6';

    //verify URL
    const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}&remoteip=${req.connection.remoteAddress}`;

    //Make Request To verify URL
    request(verifyUrl,(err,response,body)=>{
        body = JSON.parse(body);
        console.log(body);
        
        //if not successful
        if(body.success !== undefined && !body.success){
            return res.json({"success":false,"msg":"Failed captcha Verification"});
        }
        //if successful
        
        if(body.success == true){
            const doCommentdata = {
                name: req.body.name,
                email: req.body.email,
                comment: req.body.comment,
                status: req.body.status,
        
            }
        const doComments = new DoComments(doCommentdata);

        doComments.save();
        return res.json({"success":true,"msg":"captcha passed"});

        }
    }) 

});



//add & show category route
router.get('/admin/addcategory',function(req,res){
    res.render("admin/addcategory", { title:"Add Category" });
});

router.get('/admin/categorylists',async(req,res)=>{
    try{
        const categories = await Category.find({}).populate("posts");
        res.render("admin/categorylists", { title:"Category Lists", categories:categories, });
    }
    catch(err){
        res.send("Something went wrong");

    }

    // Category.find().populate("posts").exec((err,categories)=>{
    //     if(err){
    //         res.send("Something went wrong");
    //     } else{
    //         res.render("admin/categorylists", { title:"Add Category Lists", categories:categories, });

    //     }
    // });
});


//insert an category into database route
router.post('/addcategory',upload, async(req,res)=>{
    const categorydata = {
        title: req.body.title,
        image: req.file.filename,
        status: req.body.status,
        posts: req.postId,
    }
    console.log(categorydata);
    const category = new Category(categorydata);
    try{
        const cat = await category.save();
        await Post.updateOne({
            _id : req.postId
        },{
            $push:{
                categories: cat._id
            }
        });
        req.message={
            type: "success",
            message: "Category added successfully",
        };
        res.redirect('/admin/categorylists');
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
    // category.save((err) => {
    //     console.log(err);
    //     if(err){
    //         res.json({message: err.message, type: 'danger'});

    //     }else{
    //         req.message={
    //             type: "success",
    //             message: "Category added successfully",
    //         };
    //         res.redirect('/admin/categorylists');
    //     }
    // })
    
});
//edit an category route
router.get('/update-category/:id',function(req,res){
    let id = req.params.id;
    Category.findById(id, (err,category)=>{
        if(err){
            res.redirect("/admin/postlists");
        }else{
                res.render("admin/update_category",{
                    title: "Update post",
                    category:category,

                })
            }
        
    })
});
//update an category route
router.post('/update_category/:id',upload,function(req,res){
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


    Category.findByIdAndUpdate(id, {
        title: req.body.title,
        image: new_image,
        status: req.body.status,
    },
    (err,result)=>{
        if(err){
            res.json({message: err.message, type: 'danger'});

        }else{
            req.message={
                type: "success",
                message: "Category added successfully",
            };
            res.redirect('/admin/categorylists');
        }
    });
});
//Delete an category route
router.get('/delete-category/:id',(req,res)=>{
    let id = req.params.id;
    Category.findByIdAndRemove(id,(err,result)=>{
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
                message: "Category added successfully",
            };
            res.redirect('/admin/categorylists');
        }

    })
})


module.exports = router;