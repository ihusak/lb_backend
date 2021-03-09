const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const checkoutSchema = new Schema({
  course: {
    id: {type: String},
    name: {type: String},
    description: {type: String} 
  },
  paid: {type: Boolean, default: false},
  price: {type: Number},
  user: {
    id: {type: String},
    name: {type: String},
    roleName: {type: String} 
  }
});

module.exports = mongoose.model('Checkout', checkoutSchema);