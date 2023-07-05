const jwt = require('jsonwebtoken');
const userModel =require('../model/userModel');

const Authentication = async (req, res, next)=>{
    try{
        const token = req.headers["x-api-key"];
        if(!token){
            return res.status(400).send({status : false, message : "token is missing"})
        }
        const decodeToken = jwt.verify(token,"thisismysecretkey");
        req.decodedToken = decodeToken.userId
        next()}
    catch(error){
        if(error.message == "Invalid token"){
            return res.status(401).send({status : false, message : "Enter valid token"})
        }
        return res.status(500).send({status : false, message : error.message})
    }
}
const Authorisation = async (req,res,next)=>{
    try{
        const given_userid = req.params.userId
        const authorized_id = req.decodedToken

        if(given_userid) {

            const user = await userModel.findById(given_userid)
            if(!user)
            return res.status(400).send({status : false , message : "No user found"})

            if(given_userid !==authorized_id ) 
            return res.send({status : false , message : "Unauthorised user"})
        }
        next()
    }
    catch(error){
        return res.status(500).send({status : false, message : error.message})
    }

}

module.exports = {Authentication,Authorisation}