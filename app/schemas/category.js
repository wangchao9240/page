let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId;

let CategorySchema = new mongoose.Schema({
  name: String,
  movies: [
    {
      type: ObjectId,
      ref: 'Movie'
    }
  ],
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
});

CategorySchema.pre('save', (next) => {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now();
  } else {
    this.updateAt = Date.now();
  }
  next();
});

CategorySchema.statics = {
  fetch(cb) {
    return this
          .find({})
          .sort('meta.updateAt')
          .exec(cb)
  },
  findById(id, cb) {
    return this
          .findOne({_id: id})
          .exec(cb)
  }
};

module.exports = CategorySchema;