
const User=require('../../model/user_model')
const otp=require('../../model/otp_model')
const validation = require('../../model/validation_Schema') 

const Product = require('../../model/products_model')
// const Category = require('../../model/category_model')


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
          res.render('Home')

        }
        
    } catch (error) {
        
        console.log(error.message);

    }

}
const loadShop=async(req,res)=>{

    try{

        const productData = await Product.find({status:true})

        if(req.session.user){

            res.render('Shop' , {userlogdata : req.session.user,productData})


        } else {

            res.render('Shop',{productData})

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
        const message = req.flash('message')
        const email = req.flash('email')
        
        res.render('Login',{message,email})
        
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
const loadSingleBlog=async(req,res)=>{
    try {
        res.render('SingleBlog') 
    } catch (error) {
        console.log(error.message)
    }
}
const loadSingleProduct=async(req,res)=>{
    try {
        const id = req.query.id

        const singleProduct = await Product.findOne({_id:id,status:true}).populate('category_id')
       
        res.render('SingleProduct',{singleProduct})
    } catch (error) {
        console.log(error.meassage)
    }
    
}

const loadOtp=async(req,res)=>{

    try {

        const email = req.query.email
        
        const otpError = req.flash('otpError')

        res.render('Otp' , {email,otpError})

    } catch (error) {

        console.log(error.message)

    }

}

const insertUser = async (req, res, next) => {

    try {
    
        // --------------joi validation---------------------------------

       // const value = await validation.Registration.validateAsync(req.body)
       //const bodyEmail = value.email;

       
       const {name,email,mobile,password,c_password} = req.body
       
       const spassword = await securePassword(password)

        // insert user
  
        const user = new User({

          fullName: name,
          email: email,
          mobile: mobile,
          password: spassword,
          is_admin: false,
          is_blocked: false,
          is_verified:false,

        });

  
        req.session.saveUser = user;

        if (password == c_password) {

          // const userData = await user.save()
  
          // saving the input details into the session

          if (req.session.saveUser) {

            const OTP = generateOTP();
         
            await sendOTPmail(name, email, OTP, res,req); // passing data as argument
  
            setTimeout(async () => {

              await otp.findOneAndDelete({ emailId: email });
              
            }, 300000);

          } else {

            res.redirect("/registration");

          }

        } else {

          req.flash("passflash", "password not match");
          
          res.redirect("/registration");

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
    
    console.log(OTP)
    
    return OTP;

};

const sendOTPmail = async (username, email, sendOtp, res,req) => { 

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

      const userOTP = new otp({

        emailId: email,
        otp: sendOtp,

      });

      if(userOTP){

        userOTP.save()

        const createdAt = Date.now();
        req.session.time = createdAt
  
        res.redirect(`/otp?email=${email}&time=${createdAt}`);
      }

    } catch (error) {

      console.log(error.message);

    }

};
  
const verifyOtp=async(req,res)=>{

    try {
        const{inp1,inp2,inp3,inp4}=req.body
        const bodyOtp = inp1 + inp2 + inp3 + inp4;
        
        const userSessionData = await otp.findOne({emailId : req.session.saveUser.email});

        if(  bodyOtp == userSessionData.otp){
                    
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
                    req.session.user = userSessionData
                    res.redirect('/home')
            }else{

                req.flash('otpError', 'Incorrect OTP. Please try again.')
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

            await sendOTPmail(req.session.saveUser.fullName , req.session.saveUser.email ,generatedotp, res , req);

            setTimeout(async () => {

                await otp.findOneAndDelete({ emailId:req.session.saveUser.email});
                
              }, 60000);
  
            
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


        if (userDataa && ( userDataa.is_blocked == false ) && (userDataa.is_admin == false)) {

            const passMatch = await bcrypt.compare(Password, userDataa.password);

            if(passMatch ) {

                req.session.user = userDataa; //  Add User Data in the dbs to session
                
                res.redirect('/home');
            

            } else {

            const email = req.body.email

            req.flash('email',email)

                req.flash('message', "Incorrect username or password entered. Please try again");      //  Password Wrong (Flash)

                res.redirect('/login');

            } 

        }
        
        else if(userDataa && ( userDataa.is_blocked == true ) && (userDataa.is_admin == false)){

            req.flash('message','Your account has been blocked by an administrator.')

            res.redirect('/login')

        }

        else {
            
            const email = req.body.email

            req.flash('email',email)

            req.flash('message','Incorrect username or password entered Please try again')

            res.redirect('/login');

        }

    } catch (error) {

        console.log(error.message);
        
    }
};

const logOut = async(req , res)=>{

    try {

        req.session.user = undefined
        req.flash('message', "Logout Successfully...")
        res.redirect('/login')
        
    } catch (error) {
        
        console.log(error.message);

    }

}

const existEmail=async(req,res)=>{
    const email=await User.findOne({email:req.body.email})
    if(email) {
        res.send({exist:true});}
    else {
        res.send({exist:false});}

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
