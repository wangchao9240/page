let mongoose = require('mongoose');
let CategorySchema = require('../schemas/category.js');
let Category = mongoose.model('Category', CategorySchema);

module.exports = Category;