'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var ClipSchema = new Schema({
  content: String,
  name: String,
  comments: [{name:{ type:'string',default:'Lauren'} , info: 'string'}]
});

module.exports = mongoose.model('Clip', ClipSchema);
