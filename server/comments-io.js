'use strict';

var log = require("./logger");

module.exports = function(io) {
    io.on('connection', function(socket){
      console.log('a user connected');
      
      socket.on('add comment', function(comment) {
          console.log("Received comment: " + comment);
          
          io.emit('add comment', comment);
      });
      
      socket.on('disconnect', function() {
          console.log('a user disconnected');
      });
    });

};