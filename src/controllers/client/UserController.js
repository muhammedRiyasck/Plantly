
const User=require('../../model/user_model')
const otp=require('../../model/otp_model')

require('dotenv').config()
const bcrypt=require('bcrypt')
const nodemailer= require('nodemailer')
const session = require('express-session')

const securePassword=async(password)=>{

    try {

        const passwordhash=await bcrypt.hash(password,10)
        return passwordhash

    } catch (error) {
        console.log(error.meassage)
    }
}

const loadHome = async (req, res) => {
    // const message=req.flash('msg')
    try {

        if (req.session.user) {

            res.render('Home' , {userlogdata : req.session.user})

        } else {

            res.render('home')

        }
        
    } catch (error) {
        
        console.log(error.message);

    }

}
const loadShop=async(req,res)=>{

    try{

        if(req.session.user){

            res.render('Shop' , {userlogdata : req.session.user})


        } else {

            res.render('Shop')

        }


    }catch(error){

        console.log(error.message)

    }
}
const loadBlog=async(req,res)=>{
    try{
        if(req.session.user){

            res.render('Blog' , {userlogdata : req.session.user})


        } else {

            res.render('Blog')

        }
    }catch(error){
        console.log(error.message)
    }
}
const loadAbout=async (req,res)=>{
    try {
        if(req.session.user){

            res.render('About' , {userlogdata : req.session.user})


        } else {

            res.render('About')

        }
    } catch (error) {
        console.log(error.message)
    }
    
}
const loadContactUs=async(req,res)=>{
    try {
        if(req.session.user){

            res.render('Contact' , {userlogdata : req.session.user})


        } else {

            res.render('Contact')

        }
    } catch (error) {
        console.log(error.message)
    }
    
}
const loadLogin=async(req,res)=>{
    try {
        res.render('Login')
    } catch (error) {
        console.log(error.message)
    }
   
}
const loadRegisteration=async(req,res)=>{
    try {
        const msg=req.flash('msg')
        res.render('Registration',{msg})
    } catch (error) {
        console.log(error.meassage)
    }
   
}
const loadForgetPassword=async(req,res)=>{
    try {
        res.render('ForgotPassword')
    } catch (error) {
        console.log(error.meassage)
    }
    
}
const loadSingleBlog=(req,res)=>{
    try {
        res.render('SingleBlog') 
    } catch (error) {
        console.log(error.message)
    }
}
const loadSingleProduct=(req,res)=>{
    try {
        res.render('SingleProduct')
    } catch (error) {
        console.log(error.meassage)
    }
    
}

const loadOtp=async(req,res)=>{

    try {

        const email = req.query.email

        res.render('Otp' , {email})

    } catch (error) {

        console.log(error.message)

    }

}

const insertUser = async (req, res, next) => {
    try {

    
      const bodyEmail = req.body.email;
      const password = req.body.password
      const spassword=await securePassword(password)
      console.log(spassword)
      // check the mail from the database
      if (!bodyEmail.endsWith(".com")) {
        req.flash('msg', 'Please enter a valied mail');
        return res.redirect('/registration');
    }
  
      const emailCheck = await User.findOne({ email: bodyEmail });
     console.log(emailCheck)
      if (emailCheck) {
        req.flash("flash", "Email already exist");
        res.redirect("/registration");
      } else {
        // const first=req.body.f_name
        // const last=req.body.l_name
        // const FullName=first.charAt(0).toUpperCase() + first.slice(1)+' '+last.charAt(0).toUpperCase() + last.slice(1)
        const FullName=req.body.name
        // insert user
  
        const user = new User({
          fullName: FullName,
          email: req.body.email,
          mobile: req.body.mobile,
          password: spassword,
          is_admin: 0,
          is_blocked: false,
          is_verified:false,
        });
        const password = req.body.password;
        const confirmPassword = req.body.c_password;
  
        req.session.saveUser = user;

        if (confirmPassword == password) {
          // const userData = await user.save()
  
          // saving the input details into the session
          if (req.session.saveUser) {
            const OTP = generateOTP();
         
            await sendOTPmail(FullName, req.body.email, OTP, res,req); // passing data as argument
  
            // setTimeout(async () => {
            //   await otp.findOneAndDelete({ emailId: bodyEmail });
            // }, 60000);
          } else {
            res.redirect("/registration");
          }
        } else {
          req.flash("passflash", "password not match");

          res.redirect("/registration");
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };
const generateOTP = () => {
    
    const digits = '0123456789';

    let OTP = '';

    for (let i = 0; i < 4; i++) {

        OTP += digits[Math.floor(Math.random() * 10)];
    };      
    

    return OTP;

};

const sendOTPmail = async (username, email, sendOtp, res,req) => { 

    console.log(username);

    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD,
        },
      }); 
  
      // compose email
      const mailOption = {
        from: process.env.EMAIL,
        to: email,
        subject: "For Otp Verification",
        html: `<h3>Hello ${username}</h3><br><h1>Welcome To plantly</h3> <br> <h4>Enter Your OTP:</h4><h2>${sendOtp}<h2>`,
      };
  
      //send mail
      transporter.sendMail(mailOption, function (error, info) {
        if (error) {
          console.log("Error sending mail :- ", error.message);
        } else {
          console.log("Email has been sended :- ", info.response);
        }
      });
      // otp schema adding
      const userOTP = await otp.create({
        emailId: email,
        otp: sendOtp,
      });
   
      const createdAt = Date.now();
      req.session.time = createdAt
      res.redirect(`/otp?email=${email}&time=${createdAt}`);
    } catch (error) {
      console.log(error.message);
    }
  };
  
  

const verifyOtp=async(req,res)=>{

    try {
        const{inp1,inp2,inp3,inp4}=req.body
        const bodyOtp = inp1 + inp2 + inp3 + inp4;
        
        console.log(bodyOtp,req.session.saveUser.email,'haiii')

        const otpChek = await otp.findOne({emailId : req.session.saveUser.email});

         console.log(otpChek)
        if(otpChek && bodyOtp == otpChek.otp){
                    console.log(otpChek.otp)
                    const userSessionData = new User({

                        fullName: req.session.saveUser.fullName,
                        email: req.session.saveUser.email,
                        mobile: req.session.saveUser.mobile,
                        password: req.session.saveUser.password ,
                        is_admin: false,
                        is_blocked: false,
                        is_verified:true
                    });

                    userSessionData.save()
                    req.session.user=userSessionData
                    res.redirect('/home')
            }else{

                req.flash('msg,OTP is in Correct')
                console.log('otp is incrroect')

                const timee = req.session.time

                res.redirect(`/otp?email=${req.session.saveUser.email}&time=${timee}`);
            }
        }
    catch (error) {

        console.log(error.message)
    }
}

const ResendOtp = async (req, res ) => {
    
    try {
            const generatedotp = generateOTP();


            console.log(generatedotp + " Re-send Otp");

            console.log(req.session.saveUser.fullName + "a");

            await sendOTPmail(req.session.saveUser.fullName , req.session.saveUser.email ,generatedotp, res , req);
            
        }

    catch (error) {

        console.log(error.message);
        
    }

};

const verifyLogin = async (req, res) => {
    
    try {
        const Email = req.body.email;
        const Password = req.body.password;

        const userDataa = await User.findOne({ email: Email });


        if (userDataa && ( userDataa.is_blocked == false )) {

            const passMatch = await bcrypt.compare(Password, userDataa.password);

            if(passMatch ) {

                req.session.user = userDataa; //  Add User Data in the dbs to session
               
                res.redirect('/home');

            } else {

                console.log('wrong')

                req.flash('passError', 'Password is Wrong');      //  Password Wrong (Flash)

                res.redirect('/login');

            } 

        } else {

            console.log('not exist')
            res.render('Login', { userDosentMag: "User Dosen't Exist" });

        }

    } catch (error) {

        console.log(error.message);
        
    }
};

const logOut = async(req , res)=>{

    try {

        req.session.user = undefined

        res.redirect('/login')
        
    } catch (error) {
        
        console.log(error.message);

    }

}

const existEmail=async(req,res)=>{
    const email=await User.findOne({email:req.body.email})
    if(email) res.send({exist:true});
    else res.send({exist:false});

}

module.exports = {
    loadHome,
    loadShop,
    loadBlog,
    loadAbout,
    loadContactUs,
    loadLogin,
    loadRegisteration,
    loadForgetPassword,
    loadSingleBlog,
    loadSingleProduct,
    loadOtp,
    insertUser,
    verifyOtp,
    ResendOtp,
    verifyLogin,
    logOut,
    existEmail
   
}
