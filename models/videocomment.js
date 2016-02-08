'use strict';

var mongoose = require("mongoose");

var VideoComment = new mongoose.Schema({
    video_id: { type: Number, required: "Video ID is required!" },
    // Model comment tree with materialised paths
    path: String,
    author: {
        name: String,
        email: String
    },
    timeline: {
        time: Number
    },
    text: String
}, {
    // Options
    timestamps: true
});

VideoComment.index({'video_id': 1, 'path': 1, 'createdAt': 1});

module.exports = mongoose.model('VideoComment', VideoComment);