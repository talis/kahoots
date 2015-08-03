'use strict';

var should = require('should');
var config = require('../../config/environment');
var app = require('../../app');
var request = require('supertest');

var access_token = 'ff1b12948ef8524c066cb403c559a4c83df44c05';
var user_id_1 = 'fdgNy6QWGmIAl7BRjEsFtA';
var user_id_2 = '4cxG2Zqk3r4YemcqV10SGA';

/*describe('GET /api/clips', function() {

  it('should respond with JSON array', function(done) {
    request(app)
      .get('/api/clips')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);

        done();
      });
  });
});*/

/**
 * GET api/clips/mine/:id Test1 - access token invalid
 */
describe('GET api/clips/mine/' + user_id_1, function(){
  it('should respond with a 401 unauthorised status', function(done){
    request(app)
      .get('/api/clips/mine/' + user_id_1)
      .expect(401)
      .end(function(err, res){
        if (err!=null) throw err;
        done();
      })
  })
});
/**
 * GET api/clips/mine/:id Test2 - unknown user id, 404
 */
describe('GET api/clips/mine/1234?access_token='+access_token, function(){
  it('should respond with a 404 user not found', function(done){
    request(app)
      .get('/api/clips/mine/1234?access_token='+access_token)
      .expect(404)
      .end(function(err, res){
        if (err!=null) throw err;
        done();
      })
  })
});
/**
 * GET api/clips/mine/:id Test3 - wrong access code for user
 */
describe('GET api/clips/mine/'+user_id_1+'?access_token='+access_token, function(){
  it('should respond with 401 unauthorized', function(done){
    request(app)
      .get('/api/clips/mine/'+user_id_1+'?access_token='+access_token)
      .expect(401)
      .end(function(err, res){
        if (err!=null) throw err;
        done();
      })
  })
});
/**
 * GET api/clips/mine/:id Test4 - should return with clip bunny
 */
describe('GET api/clips/mine/'+user_id_2+'?access_token='+access_token, function(){
  it('should respond with an array with single hippo clip', function(done){
    request(app)
      .get('/api/clips/mine/'+user_id_2+'?access_token='+access_token)
      .expect('Content-Type', /json/)
      .end(function(err, res){
        if (err) return done(err);
        res.body[0].should.have.property('name', 'bunny');
        done();
      })
  })
});
/**
 * PUT api/clips/:clip_id/users/:user_id - Access token expired
 */
// todo: Need to get clip_id from seeded db.
/*describe('POST api/clips/@clip_id/users/:user_id/comments?access_token=1234', function(){
  it('should respond with a 401, unauthorised', function(done){

    request(app)
      .get('api/clips/')
  })
})*/
