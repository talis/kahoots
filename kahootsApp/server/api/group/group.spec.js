'use strict';

var should = require('should');
var config = require('../../config/environment');
var app = require('../../app');
var request = require('supertest');

var access_token = 'a9ebedbcd2c8bce89b929b84cc48c28340959529';
var expired_token = '8755ee72c3468777ff628a9e0f0bf20d31281b33';
var user1 = 'fdgNy6QWGmIAl7BRjEsFtA';
var user2 = '4cxG2Zqk3r4YemcqV10SGA';
var fakeuser = '4cxG2Zqk3r4YemcqV10SGZ';
var clip1 = "55ba24f46a50e6033add8561";
var clip2 = "55ba24f46a50e6033add8562";
var clip3 = "55ba24f46a50e6033add8563";
var clip4 = "55ba24f46a50e6033add8564";
var clip5 = "55ba24f46a50e6033add8565";
var clip6 = "55ba24f46a50e6033add8566";
var fakeclip = "55ba24f46a50e6033add8569";
var group3 = "55b690e7ac571fb05cef1a23";
var group2 = "55b690e7ac571fb05cef1a22";
var group1 = "55b690e7ac571fb05cef1a21";
var fakegroup = "55b690e7ac571fb05cef1a29";

describe('GET /api/groups', function() {

  it('should respond with JSON array', function(done) {
    request(app)
      .get('/api/groups')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        done();
      });
  });
});
