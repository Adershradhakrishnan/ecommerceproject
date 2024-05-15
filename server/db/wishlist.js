const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const wishlistSchema = new Schema({
    productId: {
        type:"string",
        ref: 'Product',
        required: true
    },
    userId: {
        type: "string",
        ref: 'user',
        required: true
    }
});

module.exports = mongoose.model('wishlist', wishlistSchema);