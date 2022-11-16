const DoComments = require('../../model/doComments');
const request = require('request');
const nodemailer = require('nodemailer');

const doComment = async(req,res)=>{

    
  const doCommentdata = {
      name: req.body.name,
      email: req.body.email,
      comment: req.body.comment,
      status: req.body.status,

  }
  console.log(doCommentdata);
  const doComments = new DoComments(doCommentdata);
  try{
      await doComments.save();
      req.message={
          type: "success",
          message: "post Comments added successfully",
      };
      res.redirect('/postdetails/postdetails');
  }
  catch(err){
      res.json({message: err.message, type: 'danger'});
  } 
};

const viewComments = async(req,res)=>{
  let id = req.params.id;
  try{
    const viewComments = await DoComments.findById(id)
    res.render("admin/view_comments",{
    title: "View Comments",
    viewComments:viewComments,
  })
  }
  catch(err){
    res.redirect("/postdetails/admin/postDetailsLists");
  }
};


const updateViewComments = async(req,res)=>{
  let id = req.params.id;
  const updateComments = await DoComments.findByIdAndUpdate(id,{
      name: req.body.name,
      email: req.body.email,
      comment: req.body.comment,
      status: req.body.status, 
  })
  console.log(updateComments);
  try{
      
              req.message={
                  type: "success",
                  message: "Comments added successfully",
              };
              res.redirect('/postdetails/admin/postDetailsLists');

      
  }catch(err){
    res.json({message: err.message, type: 'danger'});
  };
};

const postCaptcha = async(req,res)=>{
  if(
      req.body.captcha === undefined ||
      req.body.captcha === '' ||
      req.body.captcha === null

  ){
      return res.json({"success":false,"msg":"please select captcha"});
  }

  //secret key
  const secretKey = '6LeODrQiAAAAAJjJmF8tmqQZmRCZhGIvAL60OAP6';

  //verify URL
  const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}&remoteip=${req.connection.remoteAddress}`;

  //Make Request To verify URL
  request(verifyUrl,async(err,response,body)=>{
      body = JSON.parse(body);
      console.log(body);
      try{
      //if successful
      
      if(body.success == true){
        const doCommentdata = {
            name: req.body.name,
            email: req.body.email,
            comment: req.body.comment,
            status: req.body.status,
    
        }
    const doComments = new DoComments(doCommentdata);

    await doComments.save();
    return res.json({"success":true,"msg":"captcha passed"});

    }
      }
    catch(err){
        //if not successful
        if(body.success !== undefined && !body.success){
            return res.json({"success":false,"msg":"Failed captcha Verification"});
        }
      }
      
  }) 

};


module.exports = {
  doComment,
  viewComments,
  updateViewComments,
  postCaptcha
}