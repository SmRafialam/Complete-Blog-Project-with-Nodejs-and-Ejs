const Post = require('../../model/model');
const Category = require('../../model/category');
const fs = require('fs');

const AddCategory = async(req,res)=>{
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
      res.redirect('/categories/admin/categorylists');
  }
  catch(err){
      console.log(err);
      res.status(500).json({
          error: "There was a server side error!",
      });
  }
};

const getAddCategory =  async(req,res)=>{
  try{
    res.render("admin/addcategory", { title:"Add Category" });

  }catch(err){
    res.send("Something went wrong");
  }
};

const getCategoryLists = async(req,res)=>{
  try{
      const categories = await Category.find({}).populate("posts");
      res.render("admin/categorylists", { title:"Category Lists", categories:categories, });
  }
  catch(err){
      res.send("Something went wrong");
  }
};

const deleteCategory = async(req,res)=>{
  let id = req.params.id;
  try{
    const deletecategory = await Category.findByIdAndRemove(id);
    
    res.redirect('/categories/admin/categorylists');

    console.log(deletecategory);

  }catch(err){
        res.json({message: err.message, type: 'danger'});
  }
  
};

const getCategoryEdit = async(req,res)=>{
  let id = req.params.id;
  try{
    const editCategory = await Category.findById(id, (err,category)=>{
        if(err){
            res.redirect("/categories/admin/categorylists");
        }else{
                    res.render("admin/update_category",{
                    title: "Update category",
                    category:category,

                })
            }
        
    })
    await editCategory.clone();
    console.log(editCategory)

    
  }catch(err){
    console.log(err)
  }
  
};

const updateCategory = async(req,res)=>{
  let id = req.params.id;
  let new_image = "";
  if(req.file){
      new_image = req.file.filename;
      try{
          fs.unlinkSync('../../uploads/'+req.body.old_image);
      }catch(err){
          console.log(err);
      }
  }else{
      new_image = req.body.old_image;
  }


  const CategoryUpdate = await Category.findByIdAndUpdate(id, {
      title: req.body.title,
      image: new_image,
      status: req.body.status,
  });
  console.log(CategoryUpdate);
  try{
    req.message={
      type: "success",
      message: "Category added successfully",
  };
  res.redirect('/categories/admin/categorylists');
  }catch(err){
    res.json({message: err.message, type: 'danger'});

  }
};
  


module.exports = {
  AddCategory,
  getAddCategory,
  getCategoryLists,
  deleteCategory,
  getCategoryEdit,
  updateCategory
}