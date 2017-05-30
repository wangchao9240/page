let mongoose = require('mongoose');
let UserSchema = require('../schemas/user.js');
let User = mongoose.model('User', UserSchema);

module.exports = User;