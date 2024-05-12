const express = require('express');
const path = require('path')
const adminControllers = require('../../controllers/admin/AdminController');
const adminCategory=require('../../controllers/admin/AdminCategory')
const adminProducts=require('../../controllers/admin/AdminProduct')
const adminUsers=require('../../controllers/admin/AdminUser')
const adminRoute = express();
// adminRoute.use(express.static(path.join(__dirname, 'src/public/admin')));
adminRoute.set('views', './src/views/admin');  

adminRoute.get('/',adminControllers.loadLogin)
adminRoute.get('/login',adminControllers.loadLogin)
 
adminRoute.post('/verifylogin',adminControllers.verifyLogin)

adminRoute.get('/dashboard',adminControllers.loadDashboard);
adminRoute.get('/users',adminUsers.loadUsers)
adminRoute.put('/userAction' , adminUsers.statusUpdation);
adminRoute.get('/add_products',adminProducts.loadProducts)
adminRoute.get('/category',adminCategory.loadCategory)
adminRoute.post('/addCategory',adminCategory.addCategory)
adminRoute.put('/categoryList',adminCategory.catAction)
adminRoute.post('/valSet' , adminCategory.valSett);
adminRoute.post('/categoryEdit',adminCategory.categoryEdit)
adminRoute.post('/categoryDelete',adminCategory.cateDelete)
 
module.exports = adminRoute
