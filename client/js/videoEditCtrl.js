'use strict';
/* global app */

app.controller("VideoEditCtrl", ["$scope", function videoCtrl($scope) {
    $scope.aMsg = "This is a message from AngularJS";

    /**
     * Send video data to server
     * @param video
     * @param callback
     */
    function sendVideo(video, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = (function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                callback(xhr.responseText);
            }
        });

        xhr.open("POST", "/video/update", true);
        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        xhr.send(JSON.stringify($scope.video));
    }

    /**
     * Populate scope.video with embedded data received from server
     */
    $scope.loadInitVideo = function loadInitVideo() {
        // Is there information about an exisitng video?
        if (window.videoData) {
            $scope.video = JSON.parse(window.videoData);
            $scope.newVideo = false;        // Disable ID editing of existing videos
        } else {
            $scope.video = {};
            $scope.newVideo = true;
        }
    };

    /**
     * Handle form submission
     */
    $scope.submitVideo = function submitVideo() {
        console.log($scope.video);
        
        sendVideo($scope.video, function(response) {
            if (response === "OK") {
                $scope.$apply(function() {
                    $scope.msg = "Video saved successully";
                });
            }
            else {
                console.log(response);
            }
        });
    };
    
    // Load initial video data embedded by server
    $scope.loadInitVideo();
}]);