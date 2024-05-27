const express = require('express');
const app = express();

const path = require('path');
require('dotenv').config()

const nocache=require('nocache')

const mongoose=require('mongoose')
mongoose.connect(process.env.MONGO_URL);

const port = process.env.PORT

app.use(express.json());
app.use(express.urlencoded({ extended: true }))


const session = require('express-session');

app.use(nocache())

app.use(session({

    secret : '$%#',
    resave : false,
    saveUninitialized:true

}))

const flash = require('express-flash');

app.use(flash());
app.set('views',path.join(__dirname,'/src/views/client'));
// app.set('views','./src/views/admin');

app.set('view engine', 'ejs');

app.use("/assets",express.static(path.join(__dirname,'/src/public')));

const userRoute = require('./src/routes/client/userRouter');
app.use('/', userRoute);

const adminRoute = require('./src/routes/admin/adminRouter');
app.use('/admin', adminRoute);

const googleAuth = require('./googleAuth')
app.use('/',googleAuth);

app.get('*',(req,res)=>{
    res.render('404.ejs')

})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});




  
