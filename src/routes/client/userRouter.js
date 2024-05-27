const userRoute = require('express').Router()


const user_middilware = require('../../middleware/user_auth');

const userControllers = require('../../controllers/client/UserController');

userRoute.get('/',userControllers.loadHome)
userRoute.get('/home',user_middilware.isBlocked,userControllers.loadHome)
userRoute.get('/shop',user_middilware.isBlocked,userControllers.loadShop)
userRoute.get('/blog',user_middilware.isBlocked,userControllers.loadBlog)
userRoute.get('/aboutUs',user_middilware.isBlocked,userControllers.loadAbout)
userRoute.get('/contactUs',user_middilware.isBlocked,userControllers.loadContactUs)
userRoute.get('/login', user_middilware.login ,userControllers.loadLogin)
userRoute.post('/verifylogin',userControllers.verifyLogin)
userRoute.post('/logout' , userControllers.logOut);
userRoute.get('/registration', user_middilware.login ,userControllers.loadRegisteration)

userRoute.post('/registration',userControllers.insertUser)
userRoute.get('/otp', user_middilware.login,userControllers.loadOtp)
userRoute.post('/verifyotp',userControllers.verifyOtp)

userRoute.put('/emailCheck',userControllers.existEmail)

userRoute.get('/resent',user_middilware.login,userControllers.ResendOtp)
userRoute.get('/forgotPassword',userControllers.loadForgetPassword)
userRoute.get('/single-blog',user_middilware.isBlocked,userControllers.loadSingleBlog)
userRoute.get('/single-product',user_middilware.isBlocked,userControllers.loadSingleProduct)

module.exports = userRoute
