// external import
const express = require('express')
const { doComment,viewComments,updateViewComments,postCaptcha } = require('../server/controller/commentsController')
const commentRouter = express.Router()


commentRouter.post('/doComment', doComment);
commentRouter.get('/view-comments/:id', viewComments);
commentRouter.post('/view_comments/:id', updateViewComments);
commentRouter.post('/subscribe', postCaptcha);



module.exports = commentRouter
