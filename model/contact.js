const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ContactSchema = new Schema({
    fullName: {
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true,
       
    },
    number:{
        type:Number,
        required: true,
        
    },
    massage:{
        type:String,
        required: true,
    },
});

module.exports = mongoose.model("Contact",ContactSchema);
