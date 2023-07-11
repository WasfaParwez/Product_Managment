const mongoose = require('mongoose');

function TotalPrice(items, products) {
    let totalPrice = 0
    for (const item of items) {
        const product = products.find(product => product._id.toString() === item.productId.toString());
        if (product) {
            totalPrice += product.price * item.quantity;
        }
    }
    return totalPrice;
}

const isValid = (value)=>{
    if(typeof value === "undefined"|| value === null) return false
    if(typeof value === "string" && value.trim().length===0) return false
    return true
}


const sizeCheck = (str)=> {
    const arr = ["S", "XS", "M", "X", "L", "XXL", "XL"]
    for(let i = 0; i<str.length; i++){
        if(!arr.includes(str[i])){
            return false
        }
    }
    return true
}

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0;
};

//==============================================================================

const isValidEmail = function (email) {
    return email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
};

//==============================================================================

const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId);
};



module.exports = {TotalPrice,isValid,sizeCheck,isValidRequestBody,isValidObjectId}