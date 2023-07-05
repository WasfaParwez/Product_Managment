const userModel = require('../model/userModel')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bycrpt = require('bcrypt')
const {uploadFile} = require('../aws/aws')

const CreateUser = async (req,res)=>{
    try {
        let thedata= JSON.parse(req.body.data)
        const file = req.files
        const {fname , lname , email , phone , password ,address} = thedata   

//=============================NAMES===========================
        if(!fname) {
        return res.status(400).send({status: false , message : "FirstName is required"})}

        if(!lname ) {
        return res.status(400).send({status :  false , message : "LastName is required"})}
//===============================EMAIL===========================
        if(!email) {
        return res.status(400).send({status :  false , message : "Email is required"})}

        if(!validator.isEmail(email)) {
        return res.status(400).send({status : false , message  : "Enter a valid email"})}

        const userEmail = await userModel.findOne({email : email}) 
        if(userEmail) 
        return res.status(400).send({status : false , message : "Email already exist"})
        
//=====================================PHONE=========================
        if(!phone) {
        return res.status(400).send({status :  false , message : "Phone is required"}) }

        if(phone.length != 10) {
        return res.status(400).send({status : false , message : "Enter a valid phone number "})}

        const userPhone = await userModel.findOne({phone : phone}) 
        if(userPhone) 
        return res.status(400).send({status : false , message : "Phone number already exist"})
//========================PASSWORD====================================
        if(!password) {
        return res.status(400).send({status :  false , message : "Password is required"}) }

        if(password.length < 8 || password.length > 15) {
        return res.status(400).send({status : false , message : "Enter a valid password"})}

         //hashing  the password-----
         const saltRounds = 10;
         const hashedPassword = await bycrpt.hash(password, saltRounds);

//=============================ADDRESS======================================= 

        if (!address.shipping.street || !address.billing.street) {
           return  res.status(400).send({ status: false, message: 'Enter street name' })}

        if (!address.shipping.city || !address.billing.city) {
            return res.status(400).send({ status: false, message: 'Enter city name' })}
        
        if (!address.shipping.pincode || !address.billing.pincode) {
        return res.status(400).send({ status: false, message: 'Enter pincode' })}

//=================================AWS=======================================
        if(!file){
            return res.status(400).send({ status: false, message: 'file not given in form' })
        }
        if (file.length<0) {
            return res.status(400).send({ status: false, message: 'Upload profile image' });} 
       
        let uploadedFileURL= await uploadFile( file[0] )

//============================================================================
// =================CREATE USER============================
        const UserData= {
                    fname : fname , 
                    lname : lname , 
                    phone : phone ,
                    email : email , 
                    password : hashedPassword ,
                    profileImage : uploadedFileURL,
                    address : {
                    shipping : {
                        street : address.shipping.street ,
                        city : address.shipping.city ,
                        pincode : address.shipping.pincode
                    } ,
                    billing : {
                        street : address.billing.street ,
                        city : address.billing.city ,
                        pincode : address.billing.pincode
                    }
                } ,
            }
            const user = await userModel.create(UserData)
            return res.status(201).send({status : true , message : "User created successfully" , data : user})
        
} catch(error) {
        res.status(500).send({status : false , message : error.message})
    }
}
//============================================================================



const LoginUser = async (req,res) => {
    try {
        const {email , password} = req.body

        if(!email || !password) {
        return res.status(400).send({status : false , message : "Enter valid credentials "})}
//==============================EMAIL============

        if(!validator.isEmail(email)) {
        return res.status(400).send({status : false , message : "Enter the valid emailId"})}
        
        const user = await userModel.findOne({email : email})

        if(!user){ 
        return res.status(400).send({status : false , message : "User does not found"})}

//=============================PASSWORD===========

        const PasswordCheck= await bycrpt.compare(password , user.password)
        if(!PasswordCheck) {
        return res.status(400).send({status : false , message : "Invalid password"})}

//=========================TOKEN GENERATION====================

        const token = jwt.sign({userId : user._id} , "thisismysecretkey" , {expiresIn : "24h"})
        if(!token) {
        return res.status(400).send({status : false , message : "Invalid token"})}

        return res.status(200).send({status : true  , message : "User login successfull", 
        data : {userId : user._id , token : token}
        })
    } catch(error) {
        res.status(500).send({status : false , message : error.message})
    }
}
const GetUserById = async (req,res) =>{
    try {
        const userId = req.params.userId
        if(!userId) {
            return res.status(400).send({status : false , message : "Enter UserID"})}

        const theUser= await userModel.findById(userId)
        if(!theUser) {
            return res.status(400).send({status:false,message:"Give valid UserId because User not found"})
        }
        const UserDetails={
            address: {
                shipping: {
                    street: theUser.address.shipping.street,
                    city: theUser.address.shipping.city,
                    pincode: theUser.address.shipping.pincode
                },
                billing: {
                    street: theUser.address.billing.street,
                    city: theUser.address.billing.city,
                    pincode: theUser.address.billing.pincode
                }
            },
            _id: theUser._id,
            fname: theUser.fname,
            lname: theUser.lname,
            email: theUser.email,
            profileImage: theUser.profileImage,
            phone: theUser.phone,
            password: theUser.password,
            createdAt: theUser.createdAt,
            updatedAt: theUser.updatedAt,
            __v: theUser.__v
        }

        return res.status(200).send({status : true , message : "User profile details" , Data : UserDetails})
        
    } catch(error) {
        res.status(500).send({status : false , message: error.message })
    }
}

//=================================================================================

const UpdateUserbyId = async function(req,res) {
    try {
        let userId = req.params.userId
        let data = req.body 
        let {email,password,phone} = data
        if(!data) {
        return res.status(400).send({status : false , message : "Enter the data for updating"})}
//=====================Validation=============----
    if(email){
        if(!validator.isEmail(email)) {
            return res.status(400).send({status : false , message  : "Enter a valid email"})}
    
            const userEmail = await userModel.findOne({email : email}) 
            if(userEmail) 
            return res.status(400).send({status : false , message : "Email already exist"})  
    }

    if(phone){
        if(phone.length != 10) {
        return res.status(400).send({status : false , message : "Enter a valid phone number "})}
    
        const userPhone = await userModel.findOne({phone : phone}) 
        if(userPhone) 
        return res.status(400).send({status : false , message : "Phone number already exist"})
    }

    if(password){
        if(password.length < 8 || password.length > 15) {
        return res.status(400).send({status : false , message : "Enter a valid password"})}

         //hashing  the password-----
         const saltRounds = 10;
         const hashedPassword = await bycrpt.hash(data.password, saltRounds);

         data.password = hashedPassword;

    }  




//==============================================

        if(!userId) {
        return res.status(400).send({status : false , message : "Enter the userId "})}

        const User= await userModel.findById(userId)
        console.log(User)
        if(!User) {
            return res.status(400).send({status:false,message:"Give valid UserId because User not found"})
        }
        const UpdatedUser = await userModel.findByIdAndUpdate(userId , data , {new : true})

        return res.status(200).send({status : true , message : "User profile updated" , data : UpdatedUser})
        
    } catch(error) {
        res.status(500).send({Status : false , error : error.message})
    }
}






module.exports = {CreateUser,LoginUser,GetUserById,UpdateUserbyId}