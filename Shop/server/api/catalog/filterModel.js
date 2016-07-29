var mongoose = require('mongoose');
var filterSchema = new mongoose.Schema({
    _id: String,
    properties: [
        {
            "name": String,
            "value": [String]
        }
    ],
    "price": {
        "min": Number,
        "max": Number
    }
});
module.exports = mongoose.model('Filter', filterSchema);
