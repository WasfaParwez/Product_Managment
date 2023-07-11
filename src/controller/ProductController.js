const productModel = require('../model/productModel');
const {uploadFile} = require('../aws/aws');
const {isValid,isValidRequestBody,isValidObjectId} = require('../utils/validators');
const { default: mongoose } = require('mongoose');


const createProduct = async function (req , res) {
   try {
    const data = JSON.parse(req.body.data);
    const files = req.files;

    if(Object.keys(data).length == 0) 
    return res.status(400).send({status : false , message : "Provide Product Details"})
        
    const {title , price , availableSizes} = data;

    const dataFields = Object.keys(data);
    const requiredFields = ["title" , "description", "currencyId", "currencyFormat" , "availableSizes"];
    
    for(let i=0; i<requiredFields.length; i++){
        if(!dataFields.includes(requiredFields[i])) 
        return res.status(400).send({status : false,

            message : `${requiredFields[i]} is required`
        })
        if(!isValid(data[requiredFields[i]])) 
        return res.status(400).send({status : false,

            message : `${requiredFields[i]} is invalid`
        })
    }

    //-----for unique title
    let uniqueTitle = await productModel.findOne({ title: title });
    if(uniqueTitle)
    return res.status(404).send({ status: false, message: "title should be unique" });

//===============valid price=====
    if(!price){
        return res.status(404).send({ status: false, message: "price is required" });
    }
    if (typeof price !== 'number' || isNaN(price) || price < 0) {
        return res.status(404).send({ status: false, message: 'Enter a valid price' });
    }
      
   
//================== validating availableSizes 

    if (!["S", "XS", "M", "X", "L", "XXL", "XL"].includes(availableSizes)) {
        return res.status(400).send({ status: false, message: "Enter valid availableSizes" })
    }

    //============validating boolean===

    if(data.isFreeShipping){
        if(data.isFreeShipping != "true" || data.isFreeShipping != "false"){
            return res.status(400).send({status : false,message : "isFreeShipping should be a boolean value"})
        }
    };

//=======================installments: {number}
    if(data.installments){
       if (typeof data.installments !== "number") {
           return res.status(400).send({ status: false, message: "Enter valid installments" })
       }}


//===============================uploading profileImage to AWS S3

    if (files.length === 0) {
        return res.status(400).send({ status: false, message: "No file found" })
    }

    let uploadedFiles = await uploadFile(files[0])

    data.productImage = uploadedFiles

//=====================================================================

    const savedData = await productModel.create(data);

    return res.status(201).send({status : true, data : savedData});

   } catch (error) {
        return res.status(500).send({status:false , message : error})
   }

};


const getProduct = async function (req, res) {
    try {


        let { size, name, priceGreaterThan, priceLessThan, priceSort } = req.query
        let filter = {}
        filter.isDeleted = false


        if (size) {

            if (!(["S", "XS", "M", "X", "L", "XXL", "XL"].includes(size))) {

                return res.status(400).send({ status: false, message: "Please provide valid size" })
            }
            filter.availableSizes = size

        }

        if (name) {
            if (!(isValid(name))) {
                return res.status(400).send({ status: false, message: "Please provide valid title" })
            }
            filter.title = { $regex: new RegExp(name, 'i') }
        }

        if (priceGreaterThan) {
            priceGreaterThan = (+priceGreaterThan)
            if (typeof priceGreaterThan !== "number") {
            return res.status(400).send({ status: false, message: "Please provide valid number " })
            }
            filter.price = {$gt: priceGreaterThan}
        }
        if (priceLessThan) {
            priceLessThan = (+priceLessThan)
            if (typeof priceLessThan !== "number") {
            return res.status(400).send({ status: false, message: "Please provide valid number " })
            }
            // filter.price={$lt:priceLessThan}
            if (filter.price) {
                filter.price.$lt = priceLessThan
            }
            else {
                filter.price = { $lt: priceLessThan }
            }
        }

        const product = await productModel.find(filter).sort({ price: priceSort })
        if(product.length==0){
            res.status(404).send({ status: false, message: "product not found"})
        }
        return res.status(200).send({ status: true, message: "Here is the filtered data", data: product })

    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



const getProductById = async function (req , res) {
    try {
        const productId = req.params.productId;

        const isValidObjectId = mongoose.Types.ObjectId.isValid(productId);
        if(!isValidObjectId) 
        return res.status(400).send({status : false , message : "not a valid productId"})

        const productDetails = await productModel.findOne({isDeleted : false, _id : productId});

        if(!productDetails)
        return res.status(404).send({ status : false, message : "no product found with this productId" })

        return res.status(200).send({status : true , data : productDetails})
    } catch (error) {
        return res.status(500).send({status:false , message : error})
    }
};


const updateProduct = async (req, res) => {
    try {
        const productId = req.params.productId

        //body data vaidation

        let { title, description, price, currencyId, currencyFormat, style, installments, availableSizes, isFreeShipping } = req.body

        let data = {};


        // productId validation
        if (!isValidObjectId(productId)) {
            return res.status(401).send({ status: false, message: "Invalid Product Id" })
        }

        const productDetail = await productModel.findOne({ _id: productId, isDeleted: false })
        if (!productDetail) {
            return res.status(404).send({ status: false, message: "product is not found" })
        }

        // //req.body 
        if (!isValidRequestBody(req.body)) {
            return res.status(400).send({ status: false, message: "Enter data in body" })
        }

        //title: {string, mandatory, unique},
        if (title) {
            if (!isValid(title)) {
                return res.status(400).send({ status: false, message: "Enter valid title" })
            }
            const istitle = await productModel.findOne({ title: title })
            if (istitle) {
                return res.status(400).send({ status: false, message: "title is already present" })
            }
            data.title = title
        }

        // description: {string, mandatory},
        if (description) {
            if (!isValid(description)) {
                return res.status(400).send({ status: false, message: "Enter valid description" })
            }
            data.description = description
        }

        // price: {number, mandatory, valid number/decimal},
        if (price) {
            if (typeof price !== "number") {
                return res.status(400).send({ status: false, message: "Enter valid price" })
            }
            data.price = price
        }

        // currencyId: {string, mandatory, INR}
        if (currencyId) {
            if (!isValid(currencyId)) {
                return res.status(400).send({ status: false, message: "Enter valid currencyId" })
            }
            data.currencyId = currencyId
        }

        // currencyFormat: {string, mandatory, Rupee symbol},
        if (currencyFormat) {
            if (!isValid(currencyFormat)) {
                return res.status(400).send({ status: false, message: "Enter valid currencyFormat" })
            }
            data.currencyFormat = currencyFormat
        }

        // style: {string},
        if (style) {
            if (!isValid(style)) {
                return res.status(400).send({ status: false, message: "Enter valid style" })
            }
            data.style = style
        }

        // installments: {number}
        if (installments) {
            if (typeof installments !== "number") {
                return res.status(400).send({ status: false, message: "Enter valid installments" })
            }
            data.installments = installments
        }

        // availableSizes: {array of string, at least one size, enum["S", "XS","M","X", "L","XXL", "XL"]},
        if (availableSizes) {

            if (!["S", "XS", "M", "X", "L", "XXL", "XL"].includes(availableSizes)) {
                return res.status(400).send({ status: false, message: "Enter valid availableSizes" })
            }
        }
        if (isFreeShipping) {
            data.isFreeShipping = isFreeShipping
        }

        if(req.files){
        let files = req.files

        if (files.length === 0) {
            return res.status(400).send({ status: false, message: "No file found" })
        }
        let uploadedFiles = await uploadFile(files[0])

        data.productImage = uploadedFiles}

        const updateproduct = await productModel.findOneAndUpdate({ _id: productId, isDeleted: false }, 
            {$set : data,
            $addToSet: {
                availableSizes: availableSizes
            }
        },
        
            { new: true })
        return res.status(200).send({ status: true, "message": "User profile updated", data: updateproduct })

    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


const deleteProductId = async function (req , res) {
    try {
        const productId = req.params.productId;
        const isValidObjectId = mongoose.Types.ObjectId.isValid(productId);
        if(!isValidObjectId) 
        return res.status(400).send({status : false , message : "not a valid productId"})

        const product = await productModel.findOne({_id : productId , isDeleted : false});
        if(!product) return res.status(400).send({
            status : false,
            message : "product not found or already deleted"
        });

        const productDelete = await productModel.findOneAndUpdate({ _id: productId, isDeleted: false }, { isDeleted: true, deletedAt: Date.now() })
        
        return res.status(200).send({ status: true, msg: "product deleted successfully" })

    } catch (error) {
        return res.status(500).send({status:false , message : error});
    }
}

module.exports={createProduct,getProduct,getProductById,updateProduct,deleteProductId} 