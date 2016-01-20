'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var mealOptionFlavorCtrlStub = {
  index: 'mealOptionFlavorCtrl.index',
  show: 'mealOptionFlavorCtrl.show',
  create: 'mealOptionFlavorCtrl.create',
  update: 'mealOptionFlavorCtrl.update',
  destroy: 'mealOptionFlavorCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var mealOptionFlavorIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './mealOptionFlavor.controller': mealOptionFlavorCtrlStub
});

describe('MealOptionFlavor API Router:', function() {

  it('should return an express router instance', function() {
    mealOptionFlavorIndex.should.equal(routerStub);
  });

  describe('GET /api/mealOptionFlavors', function() {

    it('should route to mealOptionFlavor.controller.index', function() {
      routerStub.get
        .withArgs('/', 'mealOptionFlavorCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/mealOptionFlavors/:id', function() {

    it('should route to mealOptionFlavor.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'mealOptionFlavorCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/mealOptionFlavors', function() {

    it('should route to mealOptionFlavor.controller.create', function() {
      routerStub.post
        .withArgs('/', 'mealOptionFlavorCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/mealOptionFlavors/:id', function() {

    it('should route to mealOptionFlavor.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'mealOptionFlavorCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/mealOptionFlavors/:id', function() {

    it('should route to mealOptionFlavor.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'mealOptionFlavorCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/mealOptionFlavors/:id', function() {

    it('should route to mealOptionFlavor.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'mealOptionFlavorCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
