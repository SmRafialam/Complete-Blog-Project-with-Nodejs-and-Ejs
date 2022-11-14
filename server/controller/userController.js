const UserReg = require('../../model/userReg');

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

  const token = await registered.generateAuthToken();
  console.log("The token part " + token);

  registered.save((err) => {
      console.log(err);
      if(err){
          res.json({message: err.message, type: 'danger'});

      }else{
          req.message={
              type: "success",
              message: "User added successfully",
          };
          res.redirect('/admins/admin');
      }
  });
  console.log("The registered part " + registered);

}else{
  res.send("password not matching");
}
};

module.exports = {
  doRegistration,
  getRegister
  
}