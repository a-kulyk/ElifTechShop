var mongoose = require('mongoose');
var shopSchema = new mongoose.Schema({
  name : String,
  category: String,
  properties: [{
    name : String,
    value : String
  }],
  price: Number,
  quantity : Number,
  company: String,
  images: [String]
});
module.exports = mongoose.model('Shop', shopSchema);
