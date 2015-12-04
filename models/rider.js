'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let riderSchema = mongoose.Schema({
    destination: {type: String, required: true},
    expiration: {type: Date, required: true},
    driver: {type: Boolean, required: true},
    seates: Number,
    updated: {type: Date, default: Date.now}
  }
);

module.exports = mongoose.model('rider', riderSchema);
