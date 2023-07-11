const express= require('express')
const route= express.Router();
const AWS= require('aws-sdk');
const {CreateUser,LoginUser,GetUserById,UpdateUserbyId}=require('../controller/UserController');
const {createProduct,getProduct,getProductById,updateProduct,deleteProductId} =require('../controller/ProductController');
const { createCart, updateCart, getCart, deleteCart }=require('../controller/CartController');
const { createOrder, updateOrder }=require('../controller/OrderController');
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


//Product Api's

//create product
route.post('/products', createProduct)

//get product
route.get('/products', getProduct)
//get product by productId
route.get('/products/:productId', getProductById)

//update product by productId
route.put('/products/:productId', updateProduct)

//delete product by productId
route.delete('/products/:productId', deleteProductId)

//=========================================================================
//Cart Api's

// POST /users/:userId/cart
route.post('/users/:userId/cart', Authentication,Authorisation,createCart)

//get Cart
route.get('/users/:userId/cart', Authentication,Authorisation,getCart)

//delete Cart
route.delete('/users/:userId/cart', Authentication,Authorisation, deleteCart)

//update Cart
route.put('/users/:userId/cart',updateCart)

//=========================================================================

// Order Api

// create order 
route.post('/users/:userId/orders', Authentication, Authorisation, createOrder)

// update order
route.put('/users/:userId/orders', Authentication, Authorisation, updateOrder)

//================================================================







module.exports = route