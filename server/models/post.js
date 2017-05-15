var mongoose = require('mongoose');
var shortid = require('shortid');
var Schema = mongoose.Schema;


var Post = new Schema({
  _id: {
    type: String,
    default: shortid.generate
  },
  name: {
    type: String,
    maxlength: 256,
    required: true
  },
  syntax: {
    type: String,
    enum: ['None', 'HTML', 'Javascript', 'Python', 'Ruby'],
    default: 'None'
  },
  text: {
    type: String,
    required: true
  },
  public: {
    type: Boolean,
    default: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  views: {
    type: Number,
    default: 0
  },
  expireAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Expire at the time indicated by the expireAt field
Post.index({
  expireAt: 1
}, {
  expireAfterSeconds: 0
});

module.exports = mongoose.model('Post', Post);