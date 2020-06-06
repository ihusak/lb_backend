const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rolesSchema = new Schema({
  title: String,
  id: String
});

module.exports = mongoose.model('Roles', rolesSchema);