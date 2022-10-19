const express = require('express');
const router = express.Router();
const Post = require('../model/model');
const Category = require('../model/category');
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

//insert an post into database route
router.post('/addposts',upload,async(req,res)=>{
    const postdata = {
        title: req.body.title,
        content: req.body.content,
        shortDescription: req.body.shortDescription,
        image: req.file.filename,
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
    res.render("admin/dashboard");
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
        }).populate("categories");
        res.render("admin/postlists", { title:"Post Lists", posts:posts, });
    }
    catch(err){
        res.send("Something went wrong");

    }
        // post.find().exec((err,posts)=>{
        //     if(err){
        //         res.send("Something went wrong");
        //     } else{
        //         res.render("admin/postlists", { title:" Post Lists", posts:posts, });

        //     }
        // });
});

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
        const posts = await Post.find({
            status: 'Active'
        }).populate("categories");
        res.render("admin/postDetailsLists", { title:"Post Details Lists", posts:posts, });
    }
    catch(err){
        res.send("Something went wrong");

    }
});
router.get('/postDetailsLists',function(req,res){
    Post.find().exec((err,postDetails)=>{
        if(err){
            res.send("Something went wrong");
        } else{
            res.render("user/blogdetails", { postDetails:postDetails, });

        }
    });
});


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
                message: "post added successfully",
            };
            res.redirect('/admin/postlists');
        }

    })
})

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
        await post.updateOne({
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