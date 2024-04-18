const mongoose = require("mongoose");

const product =new mongoose.Schema({
    productName:"string",
    price:"string",
    tags:"string",
    imageFile:"string",
    shippingMethod:"string",
    sellerName:"string",
    contactEmail:"string"
})

module.exports=mongoose.model("product",product);