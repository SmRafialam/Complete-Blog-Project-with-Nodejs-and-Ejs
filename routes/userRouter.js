// external import
const express = require('express')
const { doRegistration,getRegister, } = require('../server/controller/userController')
const userRouter = express.Router()

userRouter.get('/register', getRegister);
userRouter.post('/register', doRegistration);


module.exports = userRouter
