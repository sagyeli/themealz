'use strict';

var app = require('../..');
import request from 'supertest';

var newMealOptionFlavorsGroup;

describe('MealOptionFlavorsGroup API:', function() {

  describe('GET /api/mealOptionFlavorsGroups', function() {
    var mealOptionFlavorsGroups;

    beforeEach(function(done) {
      request(app)
        .get('/api/mealOptionFlavorsGroups')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          mealOptionFlavorsGroups = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      mealOptionFlavorsGroups.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/mealOptionFlavorsGroups', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/mealOptionFlavorsGroups')
        .send({
          name: 'New MealOptionFlavorsGroup',
          info: 'This is the brand new mealOptionFlavorsGroup!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newMealOptionFlavorsGroup = res.body;
          done();
        });
    });

    it('should respond with the newly created mealOptionFlavorsGroup', function() {
      newMealOptionFlavorsGroup.name.should.equal('New MealOptionFlavorsGroup');
      newMealOptionFlavorsGroup.info.should.equal('This is the brand new mealOptionFlavorsGroup!!!');
    });

  });

  describe('GET /api/mealOptionFlavorsGroups/:id', function() {
    var mealOptionFlavorsGroup;

    beforeEach(function(done) {
      request(app)
        .get('/api/mealOptionFlavorsGroups/' + newMealOptionFlavorsGroup._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          mealOptionFlavorsGroup = res.body;
          done();
        });
    });

    afterEach(function() {
      mealOptionFlavorsGroup = {};
    });

    it('should respond with the requested mealOptionFlavorsGroup', function() {
      mealOptionFlavorsGroup.name.should.equal('New MealOptionFlavorsGroup');
      mealOptionFlavorsGroup.info.should.equal('This is the brand new mealOptionFlavorsGroup!!!');
    });

  });

  describe('PUT /api/mealOptionFlavorsGroups/:id', function() {
    var updatedMealOptionFlavorsGroup;

    beforeEach(function(done) {
      request(app)
        .put('/api/mealOptionFlavorsGroups/' + newMealOptionFlavorsGroup._id)
        .send({
          name: 'Updated MealOptionFlavorsGroup',
          info: 'This is the updated mealOptionFlavorsGroup!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedMealOptionFlavorsGroup = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedMealOptionFlavorsGroup = {};
    });

    it('should respond with the updated mealOptionFlavorsGroup', function() {
      updatedMealOptionFlavorsGroup.name.should.equal('Updated MealOptionFlavorsGroup');
      updatedMealOptionFlavorsGroup.info.should.equal('This is the updated mealOptionFlavorsGroup!!!');
    });

  });

  describe('DELETE /api/mealOptionFlavorsGroups/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/mealOptionFlavorsGroups/' + newMealOptionFlavorsGroup._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when mealOptionFlavorsGroup does not exist', function(done) {
      request(app)
        .delete('/api/mealOptionFlavorsGroups/' + newMealOptionFlavorsGroup._id)
        .expect(404)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

  });

});
