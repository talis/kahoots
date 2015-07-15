'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var GroupSchema = new Schema({
  name: String,
  info: String,
  chat: [{author:String, date:Date, comment:String}]
});

module.exports = mongoose.model('Group', GroupSchema);
