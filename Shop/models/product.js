var mongoose = require('../db');
var productSchema = new mongoose.Schema({
    name : String,
    category: String,
    description: String,
    properties: [{
        name : String,
        value : String
    }],
    price: Number,
    quantity : Number,
    company: String,
    images: [String]
});
module.exports = mongoose.model('Product', productSchema);