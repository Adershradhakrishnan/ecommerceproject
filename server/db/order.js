const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    productId: [{
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    }],
    userId: {
        type: "string", 
        ref: 'user',
        required: true
    }
});

module.exports = mongoose.model('order', orderSchema);
