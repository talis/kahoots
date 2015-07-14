'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var ClipSchema = new Schema({
  _id: String,
  content: String,
  name: String,
  comments: [String],
  source: String,
  author: String,
  datecreated: Date
});

module.exports = mongoose.model('Clip', ClipSchema);
