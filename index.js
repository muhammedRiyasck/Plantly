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

app.set('view engine', 'ejs')

const session = require('express-session');

app.use(nocache())

app.use(session({

    secret : '$%#',
    resave : false,
    saveUninitialized:true

}))

const flash = require('express-flash');

app.use(flash());

app.use("/assets",express.static(path.join(__dirname,'src/public')));
const userRoute = require('./src/routes/client/userRouter');

app.use('/', userRoute);
const adminRoute = require('./src/routes/admin/adminRouter');
app.use('/admin', adminRoute);
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});




  
