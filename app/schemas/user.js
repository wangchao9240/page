let mongoose = require('mongoose');

let UserSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true
  },
  password: String,
  role: {
    type: Number,
    default: 0
  },
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

UserSchema.pre('save', (next) => {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now();
  } else {
    this.updateAt = Date.now();
  }
  next();
});

UserSchema.statics = {
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

module.exports = UserSchema;