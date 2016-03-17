'use strict';
/* global app, io */

app.controller('CommentCtrl', ['$scope', '$sce', function($scope, $sce) {
    
    $scope.comments = [];
    $scope.newComment = {
        video_id: $scope.video._id,
        text: ""
    };
    $scope.timelineTriggers = [];
    $scope.timelineComments = [];

    var loadInitComments = function() {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = (function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                $scope.$apply( function() {
                    $scope.comments = JSON.parse(xhr.responseText);
                });
                placeTimelineComments();
            }
        });
        xhr.open("GET", "/comments/" + $scope.video._id, true);
        xhr.send();
    };

    function placeTimelineComments() {
        $scope.comments.forEach(function placeTimelineComment(comment) {
            if (comment.timeline) {
                $scope.$apply(function() {
                    $scope.timelineTriggers.push({
                        id: comment._id,
                        time: comment.timeline.time
                    });
                });
            }
        });
    }
    


    /**
     * Get Gravatar image for comment author's e-mail
     */
    $scope.getGravatarImage = function(comment) {
        var imgTag = "<img src='" +
            window.gravatar.url(comment.author.email, { s: 35, d: 'mm'}, true) +
            "' />";
        return imgTag;
    };


    /**
     * TIMELINE
     */

    /**
     * When clicking on a trigger, load and display the corresponding comment
     * @param trigger: Trigger object
     */
    $scope.showTimelineComment = function showTimelineComment(trigger) {
        console.log("loading comment at: " + trigger.time + " with ID: " + trigger.id);

        var showComment = null;

        for (var i in $scope.comments) {
            if ($scope.comments[i]._id === trigger.id) {
                showComment = $scope.comments[i];
                break;      // Use first comment with the given time
            }
        }

        if (showComment) {
            $scope.timelineComments = [];
            $scope.timelineComments.push(showComment);
            $scope.timelineModalVisible = true;
        }
    };




    /**
     * Sockets.IO
     */
    var socket = io();

    var addCommentToTree = function(comment) {
        var path = comment.path.split(",");

        if (path[1] === "") {
            // Root comment
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
        comment.replyText = '';     // Rest reply field
        $scope.replyVisible = null;           // Hide reply form
    };



    
    
    // On load - get comments from server
    loadInitComments();
}]);