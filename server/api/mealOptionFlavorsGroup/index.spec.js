'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var mealOptionFlavorsGroupCtrlStub = {
  index: 'mealOptionFlavorsGroupCtrl.index',
  show: 'mealOptionFlavorsGroupCtrl.show',
  create: 'mealOptionFlavorsGroupCtrl.create',
  update: 'mealOptionFlavorsGroupCtrl.update',
  destroy: 'mealOptionFlavorsGroupCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var mealOptionFlavorsGroupIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './mealOptionFlavorsGroup.controller': mealOptionFlavorsGroupCtrlStub
});

describe('MealOptionFlavorsGroup API Router:', function() {

  it('should return an express router instance', function() {
    mealOptionFlavorsGroupIndex.should.equal(routerStub);
  });

  describe('GET /api/mealOptionFlavorsGroups', function() {

    it('should route to mealOptionFlavorsGroup.controller.index', function() {
      routerStub.get
        .withArgs('/', 'mealOptionFlavorsGroupCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/mealOptionFlavorsGroups/:id', function() {

    it('should route to mealOptionFlavorsGroup.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'mealOptionFlavorsGroupCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/mealOptionFlavorsGroups', function() {

    it('should route to mealOptionFlavorsGroup.controller.create', function() {
      routerStub.post
        .withArgs('/', 'mealOptionFlavorsGroupCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/mealOptionFlavorsGroups/:id', function() {

    it('should route to mealOptionFlavorsGroup.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'mealOptionFlavorsGroupCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/mealOptionFlavorsGroups/:id', function() {

    it('should route to mealOptionFlavorsGroup.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'mealOptionFlavorsGroupCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/mealOptionFlavorsGroups/:id', function() {

    it('should route to mealOptionFlavorsGroup.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'mealOptionFlavorsGroupCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
