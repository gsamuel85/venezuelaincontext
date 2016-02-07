'use strict';
/* global app, io */

app.controller('CommentCtrl', ['$scope', function($scope) {
    
    var socket = io();
    
    $scope.comments = [];
    
    socket.on('add comment', function(comment) {
        $scope.$apply(function() {
            $scope.comments.push(comment);
        });
    });
    
    $scope.sendComment = function() {
        socket.emit('add comment', $scope.comment);
        
        $scope.comment = '';        // Reset field
    };
}]);