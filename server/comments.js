'use strict';

var router = require("express").Router();
var VideoComment = require("../models/videocomment");

var gravatar = require("gravatar");

var async = require("async");


var isLoggedIn = function(req,res,next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.send("Please log in");
};

var isAdmin = function isAdmin(user) {
    if (user._doc) {
        return user._doc.admin;
    }
    return false;
};

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
router.delete('/:comment_id', isLoggedIn, function deleteComment(req,res) {
    if (!isAdmin(req.user)) { return res.status(403).send("You must be an admin to perform this action"); }

    // Delete selected comment
    VideoComment.remove({_id: req.params.comment_id}, function(err) {
        if (err) { return new Error(err); }

        res.send("Comment successfully deleted");
    })
});

module.exports = router;