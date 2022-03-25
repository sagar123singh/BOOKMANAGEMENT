const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    title: {
        type: String, 
        required:true, 
        enum:["Mr", "Mrs", "Miss"]
    },
    name: {
        type:String,
         required:true
        },
    phone: {
        type:String,
        required:true, 
         unique:true,
         match:/^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/
        },
    email: {
        type:String,
        required:true, 
        unique:true,
         match:/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/
        }, 
    password: {
        type:String, 
        required:true,
        match:/^[a-zA-Z0-9'@&#.\s]{8,15}$/
    },
    cpassword: {
        type:String, 
        required:true
    },
        
    address: {
      street: {
          type:String
        },
      city: {
          type:String
        },
      pincode: {
          type:String
        }
    }
    
},{ timestamps: true });



module.exports = mongoose.model('newUser', userSchema) 
