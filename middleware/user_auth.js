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

module.exports = {

    user,
    login

}
