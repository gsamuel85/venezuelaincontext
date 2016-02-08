'use strict';
/* global app, io */

app.controller('CommentCtrl', ['$scope', function($scope) {
    
    $scope.aMsg = "This is a message from AngularJS";
    
    $scope.comments = [];
    $scope.newComment = {
        video_id: $scope.video._id,
        author: {
            name: "",
            email: ""
        },
        text: ""
    };
    
    var loadUserData = function() {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = (function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                $scope.$apply( function() {
                    var user = JSON.parse(xhr.responseText);
                    $scope.newComment.author = {
                        name: user.firstName + ' ' + user.lastName,
                        email: user.username
                    };
                });
            }
        });
        xhr.open("GET", "/user.json", true);
        xhr.send();
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
    
    $scope.sendReply = function(parentComment) {
        var reply = {
            video_id: $scope.video._id,
            author: {
                name: "Bob",
                email: "bob@gmail.com"
            },
            text: parentComment.replyText,
            parent_id: parentComment._id
        };
        
        socket.emit('add comment', reply);
    };
    
    
    // On load - get comments from server
    loadInitComments();
    loadUserData();
}]);