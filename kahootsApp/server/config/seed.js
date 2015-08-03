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
      content : 'http://www.animalslook.com/img/cute/meet-cute-pygmy-hippos/meet-cute-pygmy-hippos01.jpg',
      name    : 'hippo',
      source  : "http://www.animalslook.com/meet-cute-pygmy-hippos/?f=1",
      comments: ["wow", "yo","yo","yo","yo","yo","yo","yo","yo","yo","yo","yo","yo","yo","yo","yo","yo","yo","yo","yo","yo","yo","yo","yo","yo" ],
      author  : "fdgNy6QWGmIAl7BRjEsFtA",
      dateAdded : new Date("2015-07-28T14:35:48Z")

    },
    {
      content : 'http://funnyanimalphoto.com/wp-content/uploads/2013/11/dog_funny_face.jpg?bd03d3',
      name    : 'bunny',
      source  :"http://justcuteanimals.com/wp-content/uploads/2014/03/cute-animal-pictures-tiny-bay-rabbit.jpg",
      comments: ["cute"],
      author  : "4cxG2Zqk3r4YemcqV10SGA",
      dateAdded : new Date("2015-06-28T14:35:48Z")

    },
    {
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
  Group.create({});
});
User.find({}).remove(function(){
  User.create({
    _id:'fdgNy6QWGmIAl7BRjEsFtA',
    email: "test.tn@talis.com",
    surname: 'TestAccount',
    first_name: 'TN',
    group:[]
  },
    {
      "_id" : "4cxG2Zqk3r4YemcqV10SGA",
      "email" : "lauren.lewis@talis.com",
      "first_name" : "Lauren",
      "group" : [],
      "surname" : "Lewis"
    }
  );
});



