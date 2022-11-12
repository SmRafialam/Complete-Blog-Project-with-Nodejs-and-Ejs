const PostDetails = require('../../model/postdetails');
const DoComments = require('../../model/doComments');
const fs = require('fs');

const addPostDetails = async(req,res)=>{
  const postdetailsdata = {
      title: req.body.title,
      content: req.body.content,
      shortDescription: req.body.shortDescription,
      image: req.file.filename,
      status: req.body.status,
  }
  const postdetails = new PostDetails(postdetailsdata);
  try{
    await postdetails.save();
      req.message={
            type: "success",
            message: "post Details added successfully",
          }
    res.redirect('/postdetails/admin/postDetailsLists');          
              
  }catch(err){
    res.json({message: err.message, type: 'danger'});
    console.log(err);

  }
  postdetails.save((err) => {
      
          
      
  });
};

const getAddPostDetails = async(req,res)=>{
  try{
      
      res.render("admin/addPostDetails", { title:"Add Post Details"});
  }
  catch(err){
      res.send("Something went wrong");
  }
};

const getPostDetailsLists = async(req,res)=>{
  try{
      const postdetails = await PostDetails.find({});
      const postComments = await DoComments.find({
      });
      res.render("admin/postDetailsLists", { title:"Post Details Lists", postdetails:postdetails, postComments:postComments});
  }
  catch(err){
      res.send("Something went wrong");

  }
};

const getPostDetails = async(req,res)=>{
  try{
      const postDetails = await PostDetails.find({});
      const postComments = await DoComments.find({
          status: 'Approved',
      });
      res.render("user/blogdetails", { postDetails:postDetails, postComments:postComments});
  }
  catch(err){
      res.send("Something went wrong");
  }
};

const getPostDetailsEdit = async(req,res)=>{
  let id = req.params.id;
  try{
    const postdetails = await PostDetails.findById(id);
    res.render("admin/update_postDetails",{
                      title: "Update post Details",
                      postdetails:postdetails,
                  })
  }catch(err){
    res.redirect("/postdetails/admin/postDetailsLists");

  }
};

const updatePostDetails = async(req,res)=>{
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


  const PostDetailsUpdate = await PostDetails.findByIdAndUpdate(id, {
      title: req.body.title,
      content: req.body.content,
      shortDescription: req.body.shortDescription,
      image: new_image,
      status: req.body.status,
  });
  console.log(PostDetailsUpdate);

  try{
      req.message={
        type: "success",
        message: "post details added successfully",
    };
    res.redirect('/postdetails/admin/postDetailsLists');
  }catch(err){
    res.json({message: err.message, type: 'danger'});
  }
};

const deletePostDetails = async(req,res)=>{
  let id = req.params.id;
  try{
    const deletePostDetails = await PostDetails.findByIdAndRemove(id);
    
    res.redirect('/postdetails/admin/postDetailsLists');

    console.log(deletePostDetails);

  }catch(err){
        res.json({message: err.message, type: 'danger'});
  }
  
};

module.exports = {
  addPostDetails,
  getAddPostDetails,
  getPostDetailsLists,
  getPostDetails,
  getPostDetailsEdit,
  updatePostDetails,
  deletePostDetails
}