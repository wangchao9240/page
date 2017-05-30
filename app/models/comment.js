let mongoose = require('mongoose');
let CommentSchema = require('../schemas/comment.js');
let Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;