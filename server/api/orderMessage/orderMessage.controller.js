'use strict';

var _ = require('lodash');
var OrderMessage = require('./orderMessage.model');
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
  client.messages.create({
      to: req.body.numberTo,
      from: twilioConfigInfo.TWILIO_NUMBER,
      body: req.body.text
  }, function(error, message) {
      if (error) {
          console.log(error.message);
      }
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