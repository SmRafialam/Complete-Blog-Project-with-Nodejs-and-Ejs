// external import
const express = require('express')
const { doComment,viewComments,updateViewComments,postCaptcha } = require('../server/controller/commentsController')
const commentRouter = express.Router()
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

commentRouter.post('/doComment', doComment);
commentRouter.get('/view-comments/:id', viewComments);
commentRouter.post('/view_comments/:id',upload, updateViewComments);
commentRouter.post('/subscribe', postCaptcha);



module.exports = commentRouter
