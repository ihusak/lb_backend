const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recoveryPassSchema = new Schema({
    token: String,
    code: Number
});

module.exports = mongoose.model('RecoveryPass', recoveryPassSchema);
