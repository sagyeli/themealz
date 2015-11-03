/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var MealOption = require('../api/mealOption/mealOption.model');
var User = require('../api/user/user.model');
var Restaurant = require('../api/restaurant/restaurant.model');

MealOption.find({}).remove(function() {
  MealOption.create({
    name : 'פיצה / טוסט',
    iconUrl: '',
    info: '',
    children: []
  }, {
    name : 'סושי',
    iconUrl: '',
    info: '',
    children: []
  }, {
    name : 'כשר',
    iconUrl: '',
    info: '',
    children: []
  }, {
    name : 'פלאפל / סביח',
    iconUrl: '',
    info: '',
    children: []
  }, function() {
      console.log('finished populating meal options');
    }
  );
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

Restaurant.find({}).remove(function() {
  Restaurant.create({
    name: 'Moe\'s Tavern'
  }, {
    name: 'המסעדה הגדולה'
  }, {
    name: 'Café 80\'s'
  }, {
    name: 'Ten Forward'
  }, {
    name: 'Monk\'s Café'
  }, {
    name: 'אימפריית השמש'
  }, {
    name: 'Central Perk'
  }, {
    name: 'Cheers'
  }, function() {
      console.log('finished populating restaurants');
    }
  );
});