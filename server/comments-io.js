'use strict';

var VideoComment = require("../models/videocomment");

var gravatar = require('gravatar');

/**
 * Helper method to get the user's profile image
 * @param user: User document from database
 * @returns String of URL to profile picture
 */
var getUserProfileImageURL = function getUserProfileImageURL(user) {
    if (user.facebook.photoUrl) { return user.facebook.photoUrl; }
    if (user.google.photoUrl) { return user.google.photoUrl; }
    if (user.facebook.photoUrl) { return user.facebook.photoUrl; }

    // Nothing found? Try to get image from gravatar
    return gravatar.url(user.username, {s: 50}, true);
};

var commentsIO = function(io) {
    io.on('connection', function(socket){
      //console.log('a user connected');
      
      socket.on('add comment', function(comment) {
        
          // Fill in parent and author data
          var currentUser = socket.request.user;
          // No logged in user? Return
          if (!currentUser) { return; }

          comment.author = {
            name: currentUser.firstName + ' ' + currentUser.lastName,
            email: currentUser.username,
            profileImageURL: getUserProfileImageURL(currentUser)
          };
          comment.path = "," + (comment.parent_id ? comment.parent_id :  "");

          VideoComment.create(comment, function(err, savedComment) {
              if (err) { console.error(err); }

              io.emit('add comment', savedComment);
          });
      });
      
      // socket.on('disconnect', function() {
      //      console.log('a user disconnected');
      // });
    });

};

module.exports = commentsIO;