const mongoose = require("mongoose");

let userSchema = mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Ecom"
    },
    date:{
        type:Date,
        default:Date.now
    },
    content:{
        type:String,
        required: true
    },
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Ecom"
        }
    ]

});


module.exports = mongoose.model("Post",userSchema)