'use strict';

var mongoose = require("mongoose");

var VideoComment = new mongoose.Schema({
    video_id: { type: Number, required: "Video ID is required!" },
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

VideoComment.index({'video_id': 1, 'timeline.time': 1});
VideoComment.index({'video_id': 1, 'createdAt': 1});

module.exports = mongoose.model('VideoComment', VideoComment);