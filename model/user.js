const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    post:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Post"
        }
    ]
});


module.exports = mongoose.model('Ecom',userSchema);







