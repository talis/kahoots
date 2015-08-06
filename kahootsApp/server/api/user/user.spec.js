'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var nock = require('nock');
var request2 = require ('request');

describe('GET /api/users', function() {
  it('should respond string', function(done) {
    var scope = nock("http://localhost")
      .filteringPath(function (path) {
        return '/';
      })
      .get("/")
      .reply(200, "this should work?");

    request2("http://localhost/api/users", function (err, res, body) {
      res.should.have.status(200);
      res.body.should.equal("this should work?");
      done()
    });
  });
});

describe('GET /api/users', function() {
  it('should respond string', function(done) {
    nock("http://localhost")
      .filteringPath(function(path){
        return '/';
      })
      .get("/")
      .reply(200, "this should work?");

    request(app)
      .get('/api/users')
      .end(function(err, res) {
        if (err) return done(err);
        res.should.have.status(200);
        res.body.should.equal("this should work?");
        console.log(res.body);
        done();
      });
  });
});


