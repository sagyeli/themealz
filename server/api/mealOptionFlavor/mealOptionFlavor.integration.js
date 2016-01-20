'use strict';

var app = require('../..');
import request from 'supertest';

var newMealOptionFlavor;

describe('MealOptionFlavor API:', function() {

  describe('GET /api/mealOptionFlavors', function() {
    var mealOptionFlavors;

    beforeEach(function(done) {
      request(app)
        .get('/api/mealOptionFlavors')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          mealOptionFlavors = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      mealOptionFlavors.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/mealOptionFlavors', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/mealOptionFlavors')
        .send({
          name: 'New MealOptionFlavor',
          info: 'This is the brand new mealOptionFlavor!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newMealOptionFlavor = res.body;
          done();
        });
    });

    it('should respond with the newly created mealOptionFlavor', function() {
      newMealOptionFlavor.name.should.equal('New MealOptionFlavor');
      newMealOptionFlavor.info.should.equal('This is the brand new mealOptionFlavor!!!');
    });

  });

  describe('GET /api/mealOptionFlavors/:id', function() {
    var mealOptionFlavor;

    beforeEach(function(done) {
      request(app)
        .get('/api/mealOptionFlavors/' + newMealOptionFlavor._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          mealOptionFlavor = res.body;
          done();
        });
    });

    afterEach(function() {
      mealOptionFlavor = {};
    });

    it('should respond with the requested mealOptionFlavor', function() {
      mealOptionFlavor.name.should.equal('New MealOptionFlavor');
      mealOptionFlavor.info.should.equal('This is the brand new mealOptionFlavor!!!');
    });

  });

  describe('PUT /api/mealOptionFlavors/:id', function() {
    var updatedMealOptionFlavor;

    beforeEach(function(done) {
      request(app)
        .put('/api/mealOptionFlavors/' + newMealOptionFlavor._id)
        .send({
          name: 'Updated MealOptionFlavor',
          info: 'This is the updated mealOptionFlavor!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedMealOptionFlavor = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedMealOptionFlavor = {};
    });

    it('should respond with the updated mealOptionFlavor', function() {
      updatedMealOptionFlavor.name.should.equal('Updated MealOptionFlavor');
      updatedMealOptionFlavor.info.should.equal('This is the updated mealOptionFlavor!!!');
    });

  });

  describe('DELETE /api/mealOptionFlavors/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/mealOptionFlavors/' + newMealOptionFlavor._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when mealOptionFlavor does not exist', function(done) {
      request(app)
        .delete('/api/mealOptionFlavors/' + newMealOptionFlavor._id)
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
