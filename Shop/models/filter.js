var mongoose = require('../db');

var filterSchema = new mongoose.Schema({
    _id: String,
    properties: [{
        name : String,
        value : [String]
    }]
});

module.exports = mongoose.model('Filter', filterSchema);