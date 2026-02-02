const mongoose = require('mongoose')

const CreateCastSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    images:{
        type:String,
    }
},{timestamps:true})
module.exports = mongoose.model("Cast",CreateCastSchema)
