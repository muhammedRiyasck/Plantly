const Users=require('../../model/user_model')

const loadUsers=async(req,res)=>{

    try {

        const user = await Users.find({is_admin:{$ne:true}});
        // console.log(user)
        res.render('Users' , {user})


    } catch (error) {
        console.log(error.message)
    }
}

const statusUpdation = async(req , res)=>{

    try {

        const userId = req.query.id

        const userData = await Users.find({_id:userId})

        if(userData[0].is_blocked==true){

         const userBlocking = await Users.findOneAndUpdate({_id : userId},{$set:{is_blocked:false}});


        }else{

        const blocking = await Users.findOneAndUpdate({_id:userId},{$set:{is_blocked:true}})


        }

    } catch (error) {

        console.log(error.message);
        
    }

}


module.exports={
    loadUsers,
    statusUpdation
}
