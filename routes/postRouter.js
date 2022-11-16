// external import
const express = require('express')
const { getAddPosts, addPosts,getPostLists, deletePosts, getPostsEdit, updatePosts} = require('../server/controller/postsController')
const postService = require('../services/postService');
const multer = require('multer');


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


const postRouter = express.Router()
postRouter.get('',()=>{
  console.log("all");
})
postRouter.post('/addposts',upload , addPosts)
postRouter.get('/admin/addposts', getAddPosts)
postRouter.get('/admin/postlists', getPostLists)
postRouter.get('/delete-post/:id', deletePosts)
postRouter.get('/update-post/:id', getPostsEdit)
postRouter.post('/update_post/:id',upload, updatePosts)



module.exports = postRouter
