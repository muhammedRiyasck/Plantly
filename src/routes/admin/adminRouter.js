const express = require('express');
const adminControllers = require('../../controllers/admin/AdminController');
const adminCategory=require('../../controllers/admin/AdminCategory')
const adminProducts=require('../../controllers/admin/AdminProduct')
const adminUsers=require('../../controllers/admin/AdminUser')
const adminRoute = express()

const admin_auth = require('../.././middleware/admin_auth')

const path = require('path');
adminRoute.use(express.static(path.join(__dirname, 'src/public/admin')));
adminRoute.set('views', './src/views/admin');  
//  Path :-
const fs = require('fs');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../../public/productImages');

        // Check if directory exists, if not create it
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
    },
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        cb(null, true); // You can add more advanced file filtering here
    },
});


adminRoute.get('/',admin_auth.isLogout, adminControllers.loadLogin)
adminRoute.get('/login',admin_auth.isLogout, adminControllers.loadLogin)
 
adminRoute.post('/verifylogin',adminControllers.verifyLogin)

adminRoute.get('/dashboard',admin_auth.isLogin,adminControllers.loadDashboard);

adminRoute.get('/users',admin_auth.isLogin,adminUsers.loadUsers)
adminRoute.put('/userAction', adminUsers.statusUpdation);

adminRoute.get('/products',admin_auth.isLogin,adminProducts.loadProducts)
adminRoute.get('/addProducts',admin_auth.isLogin,adminProducts.loadAddProducts)

adminRoute.get('/category',admin_auth.isLogin,adminCategory.loadCategory)
adminRoute.post('/addCategory',adminCategory.addCategory)
adminRoute.put('/categoryList',adminCategory.categoryAction)
adminRoute.post('/valSet' , adminCategory.valSett);
adminRoute.post('/categoryEdit',adminCategory.categoryEdit)
adminRoute.post('/categoryDelete',adminCategory.categoryDelete)

adminRoute.post('/addProduct', upload.array('images', 3), adminProducts.addProducts);
adminRoute.put('/productAction',adminProducts.productAction)
adminRoute.get('/editProduct',admin_auth.isLogin,adminProducts.loadEditProduct)

adminRoute.post('/editProduct/:id',upload.fields([{ name: 'image0', maxCount: 1 }, { name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }]),adminProducts.editProduct)

adminRoute.post('/logout',adminControllers.logOut)

module.exports = adminRoute
