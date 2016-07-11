var mongoose = require('../db');

let nameReg = /^[\w]+(\s?\w+)*$/i;
let errorMessage = {
    required: 'required',
    minlength: 'too short',
    maxlength: 'too long',
    match: 'you can use only alphabet symbol, numbers and one space symbol between word',
    min: 'must be > 0'
};
var productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, errorMessage.required],
        minlength: [1, errorMessage.minlength],
        maxlength: [100, errorMessage.maxlength],
        match: [nameReg, errorMessage.match]
    },
    category: {
        type: String,
        required: [true, errorMessage.required],
        minlength: [2, errorMessage.minlength],
        maxlength: [100, errorMessage.maxlength],
        match: [nameReg, errorMessage.match]
    },
    description: {
        type: String,
        required: [true, errorMessage.required],
        minlength: [1, errorMessage.minlength],
        maxlength: [10000, errorMessage.maxlength],
    },
    properties: [{
        name :  {
            type: String,
            required: [true, errorMessage.required],
            minlength: [1, errorMessage.minlength],
            maxlength: [100, errorMessage.maxlength],
            match: [nameReg, errorMessage.match]
        },
        value :  {
            type: String,//ToDo: different type
            required: [true, errorMessage.required],
            minlength: [1, errorMessage.minlength],
            maxlength: [100, errorMessage.maxlength],
            match: [nameReg, errorMessage.match]
        }
    }],
    price: {
        type: Number,
        required: [true, errorMessage.required],
        min: [0, errorMessage.min]
    },
    quantity: {
        type: Number,
        required: [true, errorMessage.required],
        min: [0, errorMessage.min]
    },
    company:  {
        type: String,
        required: [true, errorMessage.required],
        minlength: [1, errorMessage.minlength],
        maxlength: [100, errorMessage.maxlength],
        match: [nameReg, errorMessage.match]
    },
    images: [String]
});
module.exports = mongoose.model('Product', productSchema);