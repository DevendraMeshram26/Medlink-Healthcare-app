const mongoose = require('mongoose');

const userSchema= new mongoose.Schema({

name:{
    type:String,
    required:[true,"Please enter a name"] ,
    trim:true

},
email:{
    type:String,
    required:[true,"Please enter a valid email address"],
    unique:true,
},
password:{
    type:String,
    required:[true,"Please enter a valid password"],
    min:6,
    max:16

},
role:{
    type:String,
    default:"user",
}


},{timestamps:true});


const User= new mongoose.model("User",userSchema)

module.exports = User;