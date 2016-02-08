'use strict';

var router = require("express").Router();
var VideoComment = require("../models/videocomment");

var async = require("async");


router.get('/:video_id', function(req, res) {
    // Get roots
    VideoComment.find({'video_id': req.params.video_id, 'path':  "," }).
            sort({"createdAt": 1}).
            lean().         // Return simple JSON objects
            exec(function(err, rootComments) {
                
        if (err) { return new Error(err); }
        
        // Iterate through roots and add replies
        async.map(rootComments, function getReplies(comment, cb) {
            var pathRegExp = new RegExp("^," + comment._id.toString());
            
            VideoComment.find({path: pathRegExp}).lean().exec(function addReplies(err, replies) {
                comment.replies = replies;
                cb(err, comment);
            });
            
        }, function(err, result) {
            if (err) { return new Error(err); }
            
            res.send(result);
        });
    });
});

module.exports = router;