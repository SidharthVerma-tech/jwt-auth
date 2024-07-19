const express = require('express')
const authRouter = express.Router()
const {signup_get, signup_post,login_post,login_get , logout} = require('../controller/user.controller')
authRouter.get('/signup',signup_get)
authRouter.get('/login',login_get)
authRouter.post('/signup',signup_post)
authRouter.post('/login',login_post)
authRouter.get('/logout', logout)
module.exports = authRouter