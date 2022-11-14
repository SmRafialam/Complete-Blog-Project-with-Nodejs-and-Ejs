// external import
const express = require('express')
const { getHome } = require('../server/controller/homeController')
const homeRouter = express.Router()


homeRouter.get('/', getHome);




module.exports = homeRouter
