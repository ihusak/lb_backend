const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  userName: String,
  email: String,
  userPassword: String,
  userType: {
    title: String,
    status: Boolean,
    id: Number
  },
  createdDate: { type: Date, default: Date.now },
  role: {
    id: Number,
    name: String,
    status: Boolean
  },
  confirmed: {type: Boolean, default: false},
  id: String
});

module.exports = mongoose.model('User', userSchema);