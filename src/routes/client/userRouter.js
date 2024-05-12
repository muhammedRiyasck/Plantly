const express = require('express');
const userRoute = express();

const userControllers = require('../../controllers/client/UserController');

const userAuth = require('../../../middleware/user_auth');

userRoute.set('views', './src/views/client')

userRoute.get('/', userControllers.loadHome);
userRoute.get('/home',userControllers.loadHome)
userRoute.get('/shop',userControllers.loadShop)
userRoute.get('/blog',userControllers.loadBlog)
userRoute.get('/aboutUs',userControllers.loadAbout)
userRoute.get('/contactUs',userControllers.loadContactUs)
userRoute.get('/login', userAuth.login ,userControllers.loadLogin)
userRoute.post('/verifylogin',userControllers.verifyLogin)
userRoute.post('/logout' , userControllers.logOut);
userRoute.get('/registration', userAuth.login ,userControllers.loadRegisteration)

userRoute.post('/registration',userControllers.insertUser)
userRoute.get('/otp', userAuth.login,userControllers.loadOtp)
userRoute.post('/verifyotp',userControllers.verifyOtp)

userRoute.put('/emailCheck',userControllers.existEmail)

userRoute.get('/resent', userControllers.ResendOtp)
userRoute.get('/forgotPassword',userControllers.loadForgetPassword)
userRoute.get('/single-blog',userControllers.loadSingleBlog)
userRoute.get('/single-product',userControllers.loadSingleProduct)

module.exports = userRoute
