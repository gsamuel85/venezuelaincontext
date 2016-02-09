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
    
    var addCommentToTree = function(comment) {
        var path = comment.path.split(",");
        
        console.log(path);
        
        if (path[1] === "") {
            $scope.$apply(function() {
                $scope.comments.push(comment);
            });
        } else {
            // Find parent comment
            $scope.comments.forEach(function(item) {
                if (item._id === path[1]) {
                    $scope.$apply(function() {
                        if (!item.replies) { item.replies = []; }
                        item.replies.push(comment);
                    });
                }
            });
        }
    };
    
    var socket = io();
    
    socket.on('add comment', function(comment) {
        addCommentToTree(comment);
    });
    
    $scope.sendComment = function() {
        socket.emit('add comment', $scope.newComment);
        
        $scope.newComment.text = '';        // Reset field
    };
    
    $scope.sendReply = function(comment) {
        var reply = {
            video_id: $scope.video._id,
            text: comment.replyText,
            parent_id: comment._id
        };
        
        socket.emit('add comment', reply);
        comment.replyText = '';
    };
    
    
    // On load - get comments from server
    loadInitComments();
}]);