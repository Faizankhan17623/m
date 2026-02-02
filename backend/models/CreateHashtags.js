const mongoose = require('mongoose')
const CreatehashtagSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    }
})
module.exports = mongoose.model("Hashtags",CreatehashtagSchema)