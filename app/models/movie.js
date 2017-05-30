let mongoose = require('mongoose');
let MovieSchema = require('../schemas/movie.js');
let Movie = mongoose.model('Movie', MovieSchema);

module.exports = Movie;