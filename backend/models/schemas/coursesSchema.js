const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  coachId: {type: String, default: ''},
  description: {
    text: {type: String},
    video: {type: String}
  },
  forAll: {type: Boolean, default: false},
  name: {type: String, default: ''},
  price: {type: Number, default: 0},
});

module.exports = mongoose.model('Course', courseSchema);