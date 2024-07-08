const { required } = require('joi')
const mongoose = require('mongoose')

const coupenSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    discount:{
        type:String,
        required:true
    },
    from:{
        type:Number,
        required:true
    },
    to:{
        type:Number,
        required:true
    },
    coupen_id:{
        type:String,
        required:true
    },

    image:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        default:true
    }
})

module.exports = mongoose.model('coupen',coupenSchema)
