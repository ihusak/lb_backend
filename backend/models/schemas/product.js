const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {type: String, default: ''},
  description: {type: String, default: ''},
  price: {type: Number, default: 0},
  allow: {type: Boolean, default: false},
  category: {type: Array, default: []}
});


module.exports = mongoose.model('Product', productSchema);