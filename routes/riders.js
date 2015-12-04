'use strict';

let ObjectID = require('mongodb').ObjectID;
let express = require('express');
let router = express.Router();

let Rider = require('../models/rider');

let checkError = (err, res, rider) => {
  if (err) {
    console.log('err: ', err);
    res.status(400).send(err);
  }
  else {
    res.json(rider);
  }
}

router.post('/', (req, res) => {
  console.log('New rider posted: ', req.body);
  let rider = new Rider(req.body);
  if (req.body.blackPlayer) {
    rider.blackPlayer = ObjectID(req.userId);
  }
  else if (req.body.whitePlayer) {
    rider.whitePlayer = ObjectID(req.userId);
  }
  else {
    res.status(400).send();
    return;
  }
  rider.state = 0;
  console.log('New rider: ', rider);
  rider.save((err, rider) => {
    checkError(err, res, rider);
  });
});

router.put('/:riderId', (req, res) => {
  var id = req.params.riderId;
  console.log('New move in: ', id);
  Rider.findOne({_id: id, currentMove: req.userId}, null, {sort: '-updated'})
    .populate('blackPlayer whitePlayer', 'firstName lastName _id')
    .exec((err, rider) => {
      if (err) {
        checkError(err, res);
      }
      else if (!rider) {
        checkError('Rider not found', res);
      }
      else if (rider.blackPlayer.equials(rider.currentMove)) {
        rider.blackStones.push(req.body);
        rider.currentMove = rider.whitePlayer;
      }
      else if (rider.whitePlayer.equials(rider.currentMove)) {
        rider.whiteStones.push(req.body);
        rider.currentMove = rider.blackPlayer;
      }
      rider.save((err, rider) => {
        checkError(err, res, rider);
      });
    });
});

router.put('/end/:riderId', (req, res) => {
  var id = req.params.riderId;
  console.log('New move in: ', id);
  Rider.findOne({_id: id, currentMove: req.userId}, null, {sort: '-updated'})
    .populate('blackPlayer whitePlayer', 'firstName lastName _id')
    .exec((err, rider) => {
      if (err) {
        checkError(err, res);
      }
      else if (!rider) {
        checkError('Rider not found', res);
      }
      else {
        rider.state = 3;
      }
      rider.save((err, rider) => {
        checkError(err, res, rider);
      });
    });
});

router.get('/', (req, res) => {
  console.log('Getting valid riders');
  Rider.find({state: {$lt: 3}}, null, {sort: '-updated'})
    .populate('blackPlayer whitePlayer')
    .exec((err, riders) => {
      checkError(err, res, riders);
    });
});

router.get('/:riderId', (req, res) => {
  var id = req.params.riderId;
  console.log('Getting rider with id: ', id);
  Rider.findOne({_id: id}, null, {sort: '-updated'})
    .populate('blackPlayer whitePlayer', 'firstName lastName _id')
    .exec((err, rider) => {
      checkError(err, res, rider);
    });
});

module.exports = router;
