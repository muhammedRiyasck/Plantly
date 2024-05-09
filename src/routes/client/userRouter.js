const express = require('express');
const userControllers = require('../../controllers/client/UserController');
const userRoute = express();

userRoute.set('views', './src/views/client')

userRoute.get('/', userControllers.loadHome);
userRoute.get('/home',userControllers.loadHome)
userRoute.get('/shop',userControllers.loadShop)
userRoute.get('/blog',userControllers.loadBlog)
userRoute.get('/aboutUs',userControllers.loadAbout)
userRoute.get('/contactUs',userControllers.loadContactUs)
userRoute.get('/login',userControllers.loadLogin)
userRoute.post('/verifylogin',userControllers.verifyLogin)
userRoute.post('/logout' , userControllers.logOut);
userRoute.get('/registration',userControllers.loadRegisteration)

userRoute.post('/registration',userControllers.insertUser)
userRoute.get('/otp',userControllers.loadOtp)
userRoute.post('/verifyotp',userControllers.verifyOtp)

userRoute.put('/emailCheck',userControllers.existEmail)

userRoute.get('/resent',userControllers.ResendOtp)
userRoute.get('/forgotPassword',userControllers.loadForgetPassword)
userRoute.get('/single-blog',userControllers.loadSingleBlog)
userRoute.get('/single-product',userControllers.loadSingleProduct)

module.exports = userRoute
