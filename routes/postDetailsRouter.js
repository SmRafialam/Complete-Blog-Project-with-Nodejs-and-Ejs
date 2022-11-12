// external import
const express = require('express')
const { addPostDetails,getAddPostDetails, getPostDetailsLists, getPostDetails, getPostDetailsEdit, updatePostDetails,deletePostDetails } = require('../server/controller/postdetailsController')
const postDetailsRouter = express.Router()
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

postDetailsRouter.post('/addPostDetails',upload , addPostDetails)
postDetailsRouter.get('/admin/addPostDetails', getAddPostDetails)
postDetailsRouter.get('/admin/postDetailsLists', getPostDetailsLists)
postDetailsRouter.get('/postDetails', getPostDetails)
postDetailsRouter.get('/update-postDetails/:id', getPostDetailsEdit)
postDetailsRouter.post('/update_postDetails/:id',upload, updatePostDetails)
postDetailsRouter.get('/delete-postDetails/:id', deletePostDetails)



module.exports = postDetailsRouter
