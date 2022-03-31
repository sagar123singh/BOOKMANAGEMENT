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
            type: String,
            required: true,
            unique: true,
            trim: true
        },
    
        password: {
            type: String,
            required: true,
            minlength: 8,
            maxlength: 15,
            trim: true
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
