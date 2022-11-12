const express = require('express')
const { AddCategory,getAddCategory,getCategoryLists,deleteCategory,getCategoryEdit,updateCategory} = require('../server/controller/categoriesController')
const categoryRouter = express.Router()
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

postRouter.post('/addcategory', upload, AddCategory)
postRouter.get('/admin/addcategory', getAddCategory)
postRouter.get('/admin/categorylists', getCategoryLists)
postRouter.get('/delete-category/:id', deleteCategory)
postRouter.get('/update-category/:id', getCategoryEdit)
postRouter.post('/update_category/:id',upload, updateCategory)



module.exports = categoryRouter
