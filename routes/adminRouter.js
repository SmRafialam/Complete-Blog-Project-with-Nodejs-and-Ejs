const AdminBro = require('admin-bro')
const AdminBroExpress = require('admin-bro-expressjs')
const mongoose = require('mongoose')

const adminBro = new AdminBro({
  database: [mongoose],
  rootPath:'/admin',
})

const ADMIN = {
  email: process.env.ADMIN_EMAIL || 'admin@example.com',
  password: process.env.ADMIN_PASSWORD || 'welovejs',

}

const router = AdminBroExpress.buildRouter(adminBro,{
  cookieName: process.env.ADMIN_COOKIE_NAME || 'admin-bro',
  cookiePassword: process.env.ADMIN_COOKIE_PASS || 'supersecret-and-long-password-for-the-cookie-in-the-browser',
  authenticate: async(email,password)=>{
    if(email === ADMIN.email && password ===ADMIN.password){
      return ADMIN
    }
    return null
  }
})

module.exports = router


