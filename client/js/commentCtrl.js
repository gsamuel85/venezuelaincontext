'use strict';
/* global app, io */

app.controller('CommentCtrl', ['$scope', '$http', '$location', '$anchorScroll', function($scope, $http, $location, $anchorScroll) {
    
    $scope.comments = [];
    $scope.newComment = {
        video_id: $scope.video._id,
        text: ""
    };
    $scope.timelineTriggers = [];
    $scope.timelineComments = [];

    $anchorScroll.yOffset = 80;

    /**
     * Load the comments from the server and place into the scope
     */
    var loadInitComments = function loadInitComments() {
        $http.get('/comments/' + $scope.video._id).then(
            function receivedComments(response) {
                $scope.comments = response.data;
                placeTimelineComments();
            },
            function onError(err) {
                console.error(err);
            }
        );
    };

    /**
     * Apply positioning style to timeline comment triggers
     */
    function placeTimelineComments() {
        $scope.comments.forEach(function placeTimelineComment(comment) {
            if (comment.timeline) {
                $scope.timelineTriggers.push({
                    id: comment._id,
                    time: comment.timeline.time
                });
            }
        });
    }
    


    /**
     * Get Gravatar image for comment author's e-mail
     */
    $scope.getProfileImage = function(author) {
        var imgURL = author.profileImageURL ? author.profileImageURL : window.gravatar.url(author.email, { s: 55, d: 'mm'}, true);
        var imgTag = "<img src='" + imgURL + "' />";
        return imgTag;
    };


    /************
     * TIMELINE *
     ************/

    /**
     * When clicking on a trigger, load and display the corresponding comment
     * @param trigger: Trigger object
     */
    $scope.showTimelineComment = function showTimelineComment(trigger) {
        var showComment = null;

        for (var i in $scope.comments) {
            if ($scope.comments[i]._id === trigger.id) {
                showComment = $scope.comments[i];
                break;      // Use first comment with the given time
            }
        }

        // Found a comment? Put it in the timeline comment modal
        if (showComment) {
            $scope.timelineComments = [];
            $scope.timelineComments.push(showComment);
            $scope.timelineModalVisible = true;
        }
    };

    /**
     * Add comment at the current point in the timeline
     */
    $scope.addCommentNow = function addCommentNow(){
        $scope.newComment.timeline = { time: Math.floor($scope.pop.currentTime()) };
        $location.hash("new-comment");
        $anchorScroll();
    };
    /**
     * Remove time from next comment
     */
    $scope.removeNewCommentTime = function removeNewCommentTime() {
        $scope.newComment.timeline = null;
    };


    /**
     * Admin deletes a comment
     * @param comment
     */
    $scope.deleteComment = function deleteComment(comment) {
        var confirmDelete = confirm("Are you sure? This comment will be permanently deleted");

        if (confirmDelete) {
            $http.delete('/comments/' + comment._id).then(
                function onDeleteSuccess(response) {
                    // TODO: Dynmically remove just the deleted comment, also for replies
                    $scope.comments = $scope.comments.filter(function(scopeComment) {
                        return scopeComment._id !== comment._id;
                    });
                },
                function onDeleteError(err) {
                    console.error(err);
                }
            );

        }
    };

    $scope.viewAuthor = function viewAuthor(email) {
        window.location.assign("/user/" + encodeURIComponent(email));
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
        placeTimelineComments();
    });
    
    $scope.sendComment = function() {
        socket.emit('add comment', $scope.newComment);

        // Reset fields
        $scope.newComment.text = '';
        $scope.newComment.timeline = null;

    };
    
    $scope.sendReply = function(comment) {
        var reply = {
            video_id: $scope.video._id,
            text: comment.replyText,
            parent_id: comment._id
        };
        
        socket.emit('add comment', reply);

        $scope.replyVisible = null;           // Hide reply form
        comment.replyText = '';              // Reset reply field
    };


    
    // On load - get comments from server
    loadInitComments();
}]);