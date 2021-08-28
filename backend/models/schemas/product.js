const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {type: String, default: ''},
  description: {type: String, default: ''},
  images: {type: Array, default: [String]},
  price: {type: Number, default: 0},
  skillz: {type: Number, default: 0},
  category: {type: Object, default: {}},
  sizes: {type: Array, default: [Object]},
  available: {type: Boolean, default: false},
  sale: {type: Number, default: 0},
  manufacturer: {type: String, default: ''}
});


module.exports = mongoose.model('Product', productSchema);
