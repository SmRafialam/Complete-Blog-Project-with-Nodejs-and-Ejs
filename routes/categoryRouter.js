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

categoryRouter.post('/addcategory', upload, AddCategory)
categoryRouter.get('/admin/addcategory', getAddCategory)
categoryRouter.get('/admin/categorylists', getCategoryLists)
categoryRouter.get('/delete-category/:id', deleteCategory)
categoryRouter.get('/update-category/:id', getCategoryEdit)
categoryRouter.post('/update_category/:id',upload, updateCategory)



module.exports = categoryRouter
