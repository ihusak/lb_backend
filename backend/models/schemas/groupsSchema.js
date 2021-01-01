const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const groupSchema = new Schema({
  name: {type: String, default: ''},
  forAll: {type: Boolean, default: false},
  coachId: {type: String, default: ''}
});

module.exports = mongoose.model('Group', groupSchema);