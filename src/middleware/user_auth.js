
const User = require('../model/user_model')

const user = async(req , res , next) => {

    try {

        if(!req.session.user){

            res.redirect('/login')

        } else {

            next()

        }
        
    } catch (error) {

        console.log(error.message);
        
    }

}


// const isUserAutharized = async (req, res, next) => {


//     if (!req.session.user) {

//         return res.redirect('/api/v1/')


//     }
//     let id = req.session.user._id
//     let user = await User.findById({ _id: id, })
//     if (user.is_blocked == true) {
//         req.session.user = null
//         res.redirect('/api/v1/')
//     }
//     next()


// }

const login = async(req , res , next)=>{

    try {

        if(req.session.user){

            res.redirect('/')

        } else {

            next()

        }
        
    } catch (error) {

        console.log(error.message);
        
    }

}



const isBlocked = async (req, res, next) => {
    
    try {

        if (req.session.user) {
            
            const userData = await User.findOne({ _id: req.session.user._id });

            if (userData?.is_blocked == true) {
                
                delete req.session.user;
                return res.redirect('/login');

            } else {

                next()

            }

        } else {

            next()

        }
        
    } catch (error) {

        console.log(error.message);
        
    }

}

module.exports = {

    
    login,
    user,
    isBlocked

}
