const express= require('express')
const route= express.Router();
const AWS= require('aws-sdk');
const {CreateUser,LoginUser,GetUserById,UpdateUserbyId}=require('../controller/controller')
const {Authentication,Authorisation}=require('../middleware/middleware')

AWS.config.update({
    accessKeyId: "AKIAY3L35MCRZNIRGT6N",
    secretAccessKey: "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",
    region: "ap-south-1"
})

route.post('/register',CreateUser);

route.post('/login',LoginUser);

route.get('/user/:userId/profile',Authentication,GetUserById);

route.put('/user/:userId/profile',Authentication,Authorisation,UpdateUserbyId)










module.exports = route