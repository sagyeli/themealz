'use strict';

var _ = require('lodash');
var OrderMessage = require('./orderMessage.model');
var Restaurant = require('./../restaurant/restaurant.model');
var twilio = require('twilio');
var fs = require('fs');
var twilioConfigInfo = JSON.parse(fs.readFileSync('./twilio.conf.js', 'utf8'));
var client = new twilio.RestClient(twilioConfigInfo.ACCOUNT_SID, twilioConfigInfo.AUTH_TOKEN);

// Get list of orderMessages
exports.index = function(req, res) {
  OrderMessage.find(function (err, orderMessages) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(orderMessages);
  });
};

// Get a single orderMessage
exports.show = function(req, res) {
  OrderMessage.findById(req.params.id, function (err, orderMessage) {
    if(err) { return handleError(res, err); }
    if(!orderMessage) { return res.status(404).send('Not Found'); }
    return res.json(orderMessage);
  });
};

// Creates a new orderMessage in the DB.
exports.create = function(req, res) {
console.log(req.body.restaurant);
  Restaurant.findOne({ _id: req.body.restaurant }, function (err, restaurant) {
    if(err) { return handleError(res, err); }
    for (var i = 0 ; restaurant && i < restaurant.phoneNumbers.length ; i++) {
      var phoneNumber = restaurant.phoneNumbers[i],
        startTimeForCurrentDay = phoneNumber.startTime ? phoneNumber.startTime - (new Date(phoneNumber.startTime)).setHours(0,0,0,0) + (new Date()).setHours(0,0,0,0) : null,
        endTimeForCurrentDay = phoneNumber.endTime ? phoneNumber.endTime - (new Date(phoneNumber.endTime)).setHours(0,0,0,0) + (new Date()).setHours(0,0,0,0) : null,
        currentTime = new Date().getTime();

      if (phoneNumber.sms && !(startTimeForCurrentDay && currentTime < startTimeForCurrentDay) && !(endTimeForCurrentDay && currentTime > endTimeForCurrentDay)) {
        var numberTo = (phoneNumber.number || '').replace(/\D/g,'');
        break;
      }
    }

    client.messages.create({
        to: numberTo,
        from: twilioConfigInfo.TWILIO_NUMBER,
        body: req.body.text
    }, function(error, message) {
        if (error) {
            console.log(error.message);
        }
    });
  });

  OrderMessage.create(req.body, function(err, orderMessage) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(orderMessage);
  });
};

// Updates an existing orderMessage in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  OrderMessage.findById(req.params.id, function (err, orderMessage) {
    if (err) { return handleError(res, err); }
    if(!orderMessage) { return res.status(404).send('Not Found'); }
    var updated = _.merge(orderMessage, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(orderMessage);
    });
  });
};

// Deletes a orderMessage from the DB.
exports.destroy = function(req, res) {
  OrderMessage.findById(req.params.id, function (err, orderMessage) {
    if(err) { return handleError(res, err); }
    if(!orderMessage) { return res.status(404).send('Not Found'); }
    orderMessage.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}