/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

//var Thing = require('../api/thing/thing.model');
var Clip = require('../api/clip/clip.model');
var Group = require('../api/group/group.model');
var User = require('../api/user/user.model');



Clip.find({}).remove(function() {
  Clip.create({
    _id     : "55ba24f46a50e6033add8561",
    content : 'https://s-media-cache-ak0.pinimg.com/236x/05/68/48/056848eb54bc03e7f06b3b5505ce7c13.jpg',
    name    : 'platypus',
    source  : "https://www.pinterest.com/nicoleluvsjake/stupid-animals-why-are-you-so-cute-and-freaking-fl/",
    comments: [],
    author  : "fdgNy6QWGmIAl7BRjEsFtA",
    dateAdded : new Date("2014-07-28T14:35:48Z")
  },
    {
      _id     : "55ba24f46a50e6033add8562",
      content : 'http://i390.photobucket.com/albums/oo343/R12ky12/cute-stupid-thing.jpg',
      name    : 'dogface',
      source  : "http://s390.photobucket.com/user/R12ky12/media/cute-stupid-thing.jpg.html",
      comments: [],
      author  : "4cxG2Zqk3r4YemcqV10SGA",
      dateAdded : new Date("2014-06-28T14:35:48Z")
    },
    {
      _id     : "55ba24f46a50e6033add8563",
      content : 'http://cretique.com/wp-content/uploads/2015/06/wonderful-food-art-ideas-for-cute-meals1.jpg',
      name    : 'cat soup',
      source  : "http://cretique.com/wonderful-food-art-ideas-for-cute-meals/",
      comments: [],
      author  : "fdgNy6QWGmIAl7BRjEsFtA",
      dateAdded : new Date("2014-07-28T14:35:48Z")
    }
  );
});


Group.find({}).remove(function(){
  Group.create({
      "_id" : "55b690e7ac571fb05cef1a23",
      "name" : "Test group 3",
      "info" : "This is test group 3",
      "clips" : [ "55ba24f46a50e6033add8566"],
      "users" : [
        "fdgNy6QWGmIAl7BRjEsFtA"
      ],
      "chat" : [ ]
    },{
      "_id" : "55b690e7ac571fb05cef1a21",
      "name" : "Test group 1",
      "info" : "This is test group 1",
      "clips" : [ "55ba24f46a50e6033add8566","55ba24f46a50e6033add8565"],
      "users" : [
        "4cxG2Zqk3r4YemcqV10SGA"
      ],
      "chat" : [ ],
    },{
      "_id" : "55b690e7ac571fb05cef1a22",
      "name" : "Test group 2",
      "info" : "This is test group 2",
      "clips" : [ ],
      "users" : [
        "4cxG2Zqk3r4YemcqV10SGA",
        "fdgNy6QWGmIAl7BRjEsFtA"
      ],
      "chat" : [ ]
    }


  );
});
User.find({}).remove(function(){
  User.create({
    _id:'fdgNy6QWGmIAl7BRjEsFtA',
    email: "test.tn@talis.com",
    surname: 'TestAccount',
    first_name: 'TN',
    group:["55b690e7ac571fb05cef1a23","55b690e7ac571fb05cef1a22"]
  },
    {
      "_id" : "4cxG2Zqk3r4YemcqV10SGA",
      "email" : "lauren.lewis@talis.com",
      "first_name" : "Lauren",
      "group" : ["55b690e7ac571fb05cef1a22","55b690e7ac571fb05cef1a22"],
      "surname" : "Lewis"
    }
  );
});



