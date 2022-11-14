// external import
const express = require('express')
const { getAdmin,doAdminLogin,doAdminLogout } = require('../server/controller/adminController')
const adminRouter = express.Router()


adminRouter.get('/admin', getAdmin);
adminRouter.post('/do-admin-login', doAdminLogin);
adminRouter.get('/do-logout', doAdminLogout);


module.exports = adminRouter
