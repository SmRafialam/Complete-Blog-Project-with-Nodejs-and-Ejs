const UserReg = require('../../model/userReg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const getAdmin = async(req,res)=>{
  res.render("admin/login")
};

const doAdminLogin = async(req,res)=>{

  const email = req.body.email;
  const RegPassword= req.body.RegPassword;

  try{

      const userData = await UserReg.findOne({
          email:email,
      });

      const isMatch = await bcrypt.compare(RegPassword, userData.RegPassword);
      console.log(isMatch);


      const token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
      userData.tokens = userData.tokens.concat({token:token})

      // const token =  userData.generateAuthToken();
      // console.log("The token part " + token);

      if(isMatch){      
          res.render('admin/dashboard');
      }
      else{
          res.render('admin/login',{message: "email and password is incorrect"});
      }
  }
  catch(err){
      res.send("Invalid login details");
  }            
};

const doAdminLogout = async(req,res)=>{
  try{
    req.session.destroy();
    res.redirect("/admins/admin");
  }catch(err){
    res.send("something wrong!");
  }
};

module.exports = {
  getAdmin,
  doAdminLogin,
  doAdminLogout
}