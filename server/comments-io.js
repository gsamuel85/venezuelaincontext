'use strict';

var VideoComment = require("../models/videocomment");

var commentsIO = function(io) {
    io.on('connection', function onConnect(socket){

        /**
         * When a comment is received, add the data of the currently logged in user
         * When the comment is successfully saved, emit an event to update the client
         */
        socket.on('add comment', function addComment(comment) {
        
          // Fill in parent and author data
          var currentUser = socket.request.user;
          // No logged in user? Return
          if (!currentUser) { return; }

          comment.author = {
            name: currentUser.firstName + ' ' + currentUser.lastName,
            email: currentUser.username
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