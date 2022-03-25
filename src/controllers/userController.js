const userModel = require("../models/userModel")



const createUser = async function (req, res) {
    try {
        let data = req.body
        let {title,name,phone,email,password,cpassword,address} = data
        if(Object.keys(req.body).length==0) res.status(400).send({status:false, msg:"Bad request"})

        if(!title) res.status(400).send({status:false, msg:"title is required"})

        if(!name) res.status(400).send({status:false, msg:"name is required"})

        if(!phone) res.status(400).send({status:false, msg:"phone is required"})
        if(!(/^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/.test(data.phone))){
            return res.status(400).send({status:false,msg:"invalid phone number"})
         }

         if(!email) res.status(400).send({status:false, msg:"email is required"})
        if(!(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/.test(data.email))){
            return res.status(400).send({status:false,msg:"invalid email id"})
         }

         if(!password) res.status(400).send({status:false, msg:"password is required"})
        if(!(/^[a-zA-Z0-9'@&#.\s]{8,15}$/.test(data.password))){
            return res.status(400).send({status:false,msg:"invalid password"})
         }
         if(!cpassword) res.status(400).send({status:false, msg:"cpassword is required"})
         if (password != cpassword) {  // checking password password is matchng or not
            return res.status(400).send({ error: "password are not matchong" })
        }

         delete req.body["cpassword"]
         

        let phoneExist = await userModel.findOne({phone:phone})
        if(phoneExist) { return res.status(400).send({ status: false, error: `ERROR! : ${phone} this phone number already exist` }) }
        
        let emailExist = await userModel.findOne({email:email})
        if(emailExist) { return res.status(400).send({ status: false, error: `ERROR! : ${email} this email id already exist` }) }

       

        let savedData = await userModel.create(data)
        res.status(201).send({status:true, data:savedData})

    }
    catch (err) {
        return res.status(500).send({status:false,msg: err.message})
    }
}










module.exports.createUser = createUser


