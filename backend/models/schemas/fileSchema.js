const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fileSchema = new Schema({
  image: String,
  userId: String
});

module.exports = mongoose.model('File', fileSchema);