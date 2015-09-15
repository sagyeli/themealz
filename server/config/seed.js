/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var MealOption = require('../api/mealOption/mealOption.model');
var User = require('../api/user/user.model');

MealOption.find({}).remove(function() {
  MealOption.create({
    name : 'פיצה / טוסט',
    iconUrl: '',
    info: '',
    parent: null
  }, {
    name : 'סושי',
    iconUrl: '',
    info: '',
    parent: null
  }, {
    name : 'כשר',
    iconUrl: '',
    info: '',
    parent: null
  }, {
    name : 'פלאפל / סביח',
    iconUrl: '',
    info: '',
    parent: null
  });
});

User.find({}).remove(function() {
  User.create({
    provider: 'local',
    name: 'Test User',
    email: 'test@test.com',
    password: 'test'
  }, {
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'admin@admin.com',
    password: 'admin'
  }, function() {
      console.log('finished populating users');
    }
  );
});