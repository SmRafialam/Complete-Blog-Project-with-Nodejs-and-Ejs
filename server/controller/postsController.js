const Post = require('../../model/model');
const Category = require('../../model/category');
const fs = require('fs');


//insert an post into database route
const addPosts = async(req,res)=>{ 

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
      res.redirect('/posts/admin/postlists');
  }
  catch(err){
      console.log(err);
      res.status(500).json({
          error: "There was a server side error!",
      });
  }
};

//Get an add post route
const getAddPosts = async(req,res)=>{
  try{
      const categories = await Category.find({});
      console.log(categories);
      res.render("admin/addposts", { title:"Add Posts", categories:categories});
  }
  catch(err){
      res.send("Something went wrong");
  }
  
};

//Get all posts
const allPosts = async(req,res)=>{
        res.send("All posts");
    };

//Get post Lists
const getPostLists = async(req,res)=>{
  try{
      const posts = await Post.find({
          type: "true"
      }).populate("categories");
      res.render("admin/postlists", { title:"Post Lists", posts:posts, });
  }
  catch(err){
    console.log(err)
      res.send("Something went wrong");

  }
}

//Delete an post route
const deletePosts = async(req,res)=>{
  let id = req.params.id;
  console.log(req.params)
  try{
    const deletePost = await Post.findByIdAndRemove(id);
    
    res.redirect('/posts/admin/postlists');

    console.log(deletePost);

  }catch(err){
        res.json({message: err.message, type: 'danger'});
  }
  
}

//update an post route
const updatePosts = async(req,res)=>{
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
  const updatePosts = await Post.findByIdAndUpdate(id, {
    title: req.body.title,
    content: req.body.content,
    shortDescription: req.body.shortDescription,
    image: new_image,
    featuredItem: req.body.featuredItem,
    status: req.body.status,
});
console.log(updatePosts);
try{
    req.message={
        type: "success",
        message: "post added successfully",
    };
    res.redirect('/posts/admin/postlists');
}catch(err){
    res.json({message: err.message, type: 'danger'});

}
};

//edit an post route

const getPostsEdit = async(req,res)=>{
  let id = req.params.id;
  try{
    const editPost = await Post.findById(id, (err,post)=>{
        if(err){
            res.redirect("/posts/admin/postlists");
        }else{
                    res.render("admin/update_post",{
                    title: "Update post",
                    post:post,

                })
            }
        
    })
    await editPost.clone();
    console.log(editPost)

    
  }catch(err){
    console.log(err)
  }
  
};

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

module.exports = {
  addPosts,
  getAddPosts,
  allPosts,
  getPostLists,
  deletePosts,
  getPostsEdit,
  updatePosts,
  getFeaturedItem
}