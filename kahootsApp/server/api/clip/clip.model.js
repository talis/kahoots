'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var ClipSchema = new Schema({
  content: String,
  name: String,
  comments: [String],
  source: String
});

module.exports = mongoose.model('Clip', ClipSchema);
