const Post = require('../../model/model');
const Category = require('../../model/category');

const getHome = async(req,res)=>{
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
};


module.exports = {
  getHome
}