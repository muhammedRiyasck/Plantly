
const User=require('../../model/user_model')
const bcrypt=require('bcrypt')


const loadLogin=async(req,res)=>{
    try {
        const msg=req.flash('passError')
        res.render('Login.ejs',{msg})
    } catch (error) {
        console.log(error.message)
    }
}


const verifyLogin = async (req, res) => {
    
    try {
        
            const Email = req.body.email;
            const Password = req.body.password;

            console.log(Email);
            console.log(Password);

        const userDataa = await User.findOne({ email: Email });

        console.log(userDataa);
        
        if (userDataa && ( userDataa.is_admin == true )) {

            
            const passMatch = await bcrypt.compare(Password, userDataa.password);

            console.log(passMatch);

            if(passMatch ) {

                req.session.admin = userDataa; //  Add User Data in the dbs to session
               
                res.redirect("/admin/dashboard");

            } else {

                req.flash('passError', 'Password or Username is wrong');      //  Password Wrong (Flash)
                res.redirect('/admin/login');

            } 

        } else {

            res.render('Login', { msg: "Unauthorized User" });

        }

    } catch (error) {

        console.log(error.message);
        
    }
};


const loadDashboard = async (req, res) => {
    try {
        res.render('Dashboard')
    } catch (error) {
        console.log(error.message)
    }
}



module.exports = {
    loadLogin,
    loadDashboard,
    verifyLogin
}
