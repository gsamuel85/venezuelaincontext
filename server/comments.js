'use strict';

var router = require("express").Router();
var VideoComment = require("../models/videocomment");
var async = require("async");

var access = require('../config/access');


/**
 * Load edit comment page
 */
router.get('/:comment_id/edit', access.isLoggedIn, function(req, res) {
    if (!access.isAdmin(req.user)) { return res.status(403).send("You must be an admin to edit a comment"); }

    VideoComment.find({'_id': req.params.comment_id}).
        lean().
        exec(function(err, comment) {

        if (err) { return new Error(err); }
        if (!comment) { res.send("Comment not found"); }

        // Replace all \" with ' so that Angular parser can correctly read the comment text
        var sanitizedComment = JSON.stringify(comment[0]).replace(/\\"/g, "'");

        var commentData = "var commentData = `" + sanitizedComment + "`;";
        res.render('comments/edit.hjs', { commentData: commentData, user: req.user });
    });
});

/**
 * Update an existing comment
 */
router.post('/update', access.isLoggedIn, function updateComment(req, res) {
    if (!access.isAdmin(req.user)) { return res.status(403).send("You must be an admin to edit a comment"); }

    var comment = req.body;

    async.waterfall([
            function findComment(cb) {
                VideoComment.findOne({ _id: comment._id}, cb);
            },
            function createOrUpdate(foundComment, cb) {
                if (!foundComment) {
                    // Comment doesn't exist in database
                    cb(new Error('Comment not found'));
                } else {
                    // Update existing comment
                    VideoComment.findByIdAndUpdate(comment._id, {$set: comment}, cb);
                }
            }
        ], function callback(err, savedComment) {
            if (err) { return res.send("Error: " + err); }
            res.status(200).send("OK");
        }
    );
});

/**
 * Get JSON of all comments for a specified video
 * @returns JSON of roots comments and their replies, ordered by time
 */
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

/**
 * Delete a comment
 * Only an admin can delete a comment
 */
router.delete('/:comment_id', access.isLoggedIn, function deleteComment(req,res) {
    if (!access.isAdmin(req.user)) { return res.status(403).send("You must be an admin to perform this action"); }

    // Delete selected comment
    VideoComment.remove({_id: req.params.comment_id}, function(err) {
        if (err) { return new Error(err); }

        res.send("Comment successfully deleted");
    });
});

module.exports = router;