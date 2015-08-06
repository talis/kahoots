'use strict';

var config = require('../../config/environment');
var should = require('should');
var app = require('../../app');
var request = require('supertest');
var nock = require('nock');

var token = "SECRET";
var bad_token = "BADSECRET";
// Allow supertest requests through
nock.enableNetConnect(/(127.0.0.1)/);
nock(config.oauth.scheme+'://'+config.oauth.host+':'+config.oauth.port)
  .head(config.oauth.route + "SECRET")
  .reply(204);
nock(config.oauth.scheme+'://'+config.oauth.host+':'+config.oauth.port)
  .head(config.oauth.route + "BADSECRET")
  .reply(401);

var user1 = 'fdgNy6QWGmIAl7BRjEsFtA';
var user2 = '4cxG2Zqk3r4YemcqV10SGA';

describe('POST /api/users', function() {
  it('should respond with a 201, new user created', function(done) {
    var profile =  { profile: {first_name: "lorilew"}};
    request(app)
      .post('/api/users/786987')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .send(profile)
      .expect(201)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.first_name.should.equal("lorilew");
        done();
      });
  });

  it('should respond with a 200, user exists', function(done) {
    var profile =  { profile: {first_name: "lorilew"}};
    request(app)
      .post('/api/users/'+user1)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .send(profile)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        res.body._id.should.equal(user1);
        done();
      });
  });

 it('should respond with a 401, unauthorised', function(done) {

    var profile =  { profile: {first_name: "lorilew"}};
    request(app)
      .post('/api/users/'+user1)
      .set('Authorization', 'Bearer ' + bad_token)
      .send(profile)
      .expect(401)
      .end(function(err, res) {
        if (err!=null) throw err;
        console.log(res.body);
        done();
      });
  });
});

describe('GET /api/users/:id', function() {

  it('should respond with a 200, user found', function (done) {
    request(app)
      .get('/api/users/' + user1)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        res.body.first_name.should.equal("TN");
       // console.log(res.body);
        done();
      });
  });

  it('should respond with a 404, user not found', function (done) {
    request(app)
      .get('/api/users/' + 'un'+user1)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .expect(404)
      .end(function (err, res) {
        if (err!=null) throw err;
        done();
      });
  });

});

describe('PUT /api/users/:id', function() {

  it('should respond with a 200', function (done) {
    var updatedUser = {
      _id : "fdgNy6QWGmIAl7BRjEsFtA",
      group : ['1234', '43321' ]
    };

    request(app)
      .put('/api/users/' + user1)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .send(updatedUser)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        res.body.first_name.should.equal('TN');
        done();
      });
  });
  it('should respond with a 404, user not found', function (done) {
    var updatedUser = {
      _id : "fdgNy6QWGmIAl7BRjEsFtA",
      group : ['1234', '43321' ]
    };

    request(app)
      .put('/api/users/' + 'un' +user1)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .send(updatedUser)
      .expect(404)
      .end(function (err, res) {
        if (err!=null) throw err;
        done();
      });
  });

});
