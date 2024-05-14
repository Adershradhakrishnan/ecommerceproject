const mongoose = require("mongoose");

const product =new mongoose.Schema({
    productName:"string",
    userId:"string",
    price:"string",
    tags:"string",
    imageFile:"string",
    shippingMethod:"string",
    sellerName:"string",
    contactEmail:"string",

    reviews:[{
        userName: String,
        rating:Number,
        comment:String,
        date:{type:Date,default:Date.now}
    }]
})

module.exports=mongoose.model("product",product);