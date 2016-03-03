'use strict';

var mongoose = require("mongoose");

var Video = new mongoose.Schema({
    _id: Number,
    
    title: String,
    subtitle: String,
    video_url: String,
    description: String,
    
    theme: {
        prev: Number,
        next: Number
    },
    period: {
        prev: Number,
        next: Number
    }
});

module.exports = mongoose.model('Video', Video);