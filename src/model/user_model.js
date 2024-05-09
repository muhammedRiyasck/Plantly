const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({

    fullName:{
        type:String,
        required:true
    },
    mobile:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    is_verified:{
        type:Boolean,
        default:false,
    },
    is_admin:{
        type:Boolean,
        default:false
    },
    is_blocked:{
        type:Boolean,
        default:false
    },
    datejoined:{
        type:Date,
        default:Date.now()
    },

    
})

module.exports = mongoose.model('user', UserSchema);
