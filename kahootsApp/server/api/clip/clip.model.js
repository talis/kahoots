'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var ClipSchema = new Schema({
  content: String,
  name: String,
  comments: [{first_name:String, surname:String, comment:String}],
  source: String,
  author: String,
  groups: [String],
  dateAdded: Date
});

module.exports = mongoose.model('Clip', ClipSchema);
