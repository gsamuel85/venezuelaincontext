'use strict';

var VideoComment = require("../models/videocomment");

var commentsIO = function(io) {
    io.on('connection', function(socket){
      //console.log('a user connected');
      
      socket.on('add comment', function(comment) {
        
          // Fill in parent and author data
          var currentUser = socket.request.user;
          comment.author = {
            name: currentUser.firstName + ' ' + currentUser.lastName,
            email: currentUser.username
          };
          comment.path = "," + (comment.parent_id ? comment.parent_id :  "");
          
          VideoComment.create(comment, function(err, savedComment) {
              io.emit('add comment', savedComment);
          });
      });
      
      socket.on('disconnect', function() {
          // console.log('a user disconnected');
      });
    });

};

module.exports = commentsIO;