const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    productId:{
        type:"string",
        ref:'product',
        required: true
    },
    userId:{
        type:"string",
        ref:'user',
        required: true
    }
});

module.exports = mongoose.model('Order',orderSchema);