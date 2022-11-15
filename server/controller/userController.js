const UserReg = require('../../model/userReg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const getRegister = async(req,res)=>{
  res.render("admin/register")
};

const doRegistration = async(req,res)=>{
  const Password = req.body.RegPassword;
  const RepeatPassword = req.body.repeatRegPassword;

if(Password === RepeatPassword){
  const userRegister = {
      name:req.body.name,
      email:req.body.email,
      phone:req.body.phone,
      RegPassword:req.body.RegPassword,
      repeatRegPassword:req.body.repeatRegPassword,
  }
  const registered = new UserReg(userRegister);
 
    try{
        // const token = registered.generateAuthToken();
        // console.log("The token part " + token);
        const token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
        registered.tokens = registered.tokens.concat({token:token})
            
        registered.RegPassword = await bcrypt.hash(registered.RegPassword, 10);
        registered.repeatRegPassword = await bcrypt.hash(registered.RegPassword, 10); 

        const register = await registered.save()
          req.message={
            type: "success",
            message: "User added successfully",
        };
        res.redirect('/admins/admin');
        console.log("The registered part " + register);
        return token;
    }
    catch(err){
      res.json({message: err.message, type: 'danger'});
    }
    
}else{
  res.send("password not matching");
}
};

module.exports = {
  doRegistration,
  getRegister
  
}