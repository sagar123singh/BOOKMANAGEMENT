const userModel = require('../Models/userModel');
//const userController = require('../Models/userModel');
const validator = require('../Validator/validation');
const jwt = require('jsonwebtoken')

const createUser = async function(req,res) {
    try {
        const body = req.body;
        const {title,name,phone,email,password,address} = body;

        //Validate body
        if (!validator.isValidBody(body)) {
            return res.status(400).send({ status: false, msg: "User body should not be empty" });
        }

        //Validate title
        if (!validator.isValid(title)) {
            return res.status(400).send({ status: false, msg: "User title is required" });
        }

        // Validation of title
        if(!validator.isValidTitle(title)) {
            return res.status(400).send({ status: false, msg: "Invalid title"});
        }

        //Validate name
        if (!validator.isValid(name)) {
            return res.status(400).send({ status: false, msg: "User name is required" });
        }

        // Validate phone
        if(!validator.isValid(phone)) {
            return res.status(400).send({ status: false, msg: "User phone number is required"});
        }

        // Validation of phone number
        if(!validator.isValidNumber(phone)) {
            return res.status(400).send({ status: false, msg: "Invalid phone number"});
        }

        //Validate email
        if (!validator.isValid(email)) {
            return res.status(400).send({ status: false, msg: "User email is required" });
        }
        
        // Validation of email
        if(!validator.isValidEmail(email)) {
            return res.status(400).send({ status: false, msg: "Invalid email Id"});
        }

        //Validate password
        if (!validator.isValid(password)) {
            return res.status(400).send({ status: false, msg: "User password is required" });
        }

        // Validation of password
        if(!validator.isValidPassword(password)) {
            return res.status(400).send({ status: false, msg: "Invalid password"});
        }


        // Cheking duplicate Entry Of User 
        let duplicateEntries = await userModel.find();
        let duplicateLength = duplicateEntries.length

        if (duplicateLength != 0) {
            // Checking duplicate name
            const duplicateName = await userModel.findOne({ name: name });
            if (duplicateName) {
                return res.status(409).send({status: false, msg: "User Name already exists" });
            }

           // Checking duplicate phone
           const duplicatePhone = await userModel.findOne({ phone: phone });
           if (duplicatePhone) {
               return res.status(409).send({status: false, msg: "User phone number already exists" });
            }
            
            // Checking duplicate email
           const duplicateEmail = await userModel.findOne({ email: email });
           if (duplicateEmail) {
               return res.status(409).send({status: false, msg: "User emailId already exists" });
            }
        

        }

        // Finally the registration of User is successful
        const userData = await userModel.create(body)
        res.status(201).send({ status: true, msg: userData})

    }
    catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ msg: "Error", error: err.message })
    }
}




const loginUser = async function (req, res) {
    try {
        const requestBody = req.body;
         //Validate body
         if (!validator.isValidBody(requestBody)) {
            return res.status(400).send({ status: false, msg: "User body should not be empty" });
        }

        const {email,password }= requestBody                ///destructuring method

          //Validate email
          if (!validator.isValid(email)) {
            return res.status(400).send({ status: false, msg: "User email is required" });
        }
        
        // Validation of email
        if(!validator.isValidEmail(email)) {
            return res.status(400).send({ status: false, msg: "Invalid email Id"});
        }

        //Validate password
        if (!validator.isValid(password)) {
            return res.status(400).send({ status: false, msg: "User password is required" });
        }

        // Validation of password
        if(!validator.isValidPassword(password)) {
            return res.status(400).send({ status: false, msg: "Invalid password"});
        }

       

      let user = await userModel.findOne({ email, password });
      if (!user){
        res.status(400).send({ status: false, msg: "invalid login credentials" });
        return
    }

      //On a successful login attempt return a JWT token contatining the userId, exp, iat.
  
      const token = jwt.sign(
        {
          userId: user._id,
          expiry: Math.floor(Date.now( )/ 1000) +20*60*60,       
          iat : Math.floor(Date.now()/1000)
        },
        "mynameissagarsinghsolankiandcurrentlyipursuingmygraduationinmaharishidayananduniversityrohatak")
    
      res.setHeader("x-auth-token", token);
      res.status(200).send({ status: true,message:"Author login successfully", data: token });
    } catch (error) {
      res.status(500).send({ status: "failed", message: error.message });
    }
  };
  
  





  
module.exports.createUser = createUser
module.exports.loginUser=loginUser


