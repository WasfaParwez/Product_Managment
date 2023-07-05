const mongoose = require('mongoose');
const route= require('./route/route');
const multer= require('multer');
const express= require('express')
const app= express();
require('dotenv').config();

const{ PORT,MONGODB_URL}= process.env


app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(multer().any())

mongoose.connect(MONGODB_URL,{useNewUrlParser:true})
.then(()=>(console.log('Connected to Mongodb database')))
.catch((err)=>(console.log(err)))

app.use('/',route)

app.listen(PORT,function(){
    console.log('running on port 3000')
})