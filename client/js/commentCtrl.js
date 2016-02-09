'use strict';
/* global app, io */

app.controller('CommentCtrl', ['$scope', function($scope) {
    
    $scope.aMsg = "This is a message from AngularJS";
    
    $scope.comments = [];
    $scope.newComment = {
        video_id: $scope.video._id,
        text: ""
    };
    
    var loadInitComments = function() {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = (function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                $scope.$apply( function() {
                    $scope.comments = JSON.parse(xhr.responseText);
                });
            }
        });
        xhr.open("GET", "/comments/" + $scope.video._id, true);
        xhr.send();
    };
    
    var socket = io();
    
    socket.on('add comment', function(comment) {
        $scope.$apply(function() {
            $scope.comments.push(comment);
        });
    });
    
    $scope.sendComment = function() {
        socket.emit('add comment', $scope.newComment);
        
        $scope.newComment.text = '';        // Reset field
    };
    
    
    // On load - get comments from server
    loadInitComments();
}]);