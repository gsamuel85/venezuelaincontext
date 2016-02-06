'use strict';
/* global app */

app.controller("VideoEditCtrl", ["$scope", function videoCtrl($scope) {
    $scope.aMsg = "This is a message from AngularJS";
    
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
    
    $scope.loadInitVideo = function() {
        // Is there information about an exisitng video?
        if (window.videoData) {
            $scope.video = JSON.parse(window.videoData);
            $scope.newVideo = false;        // Disable ID editing of existing videos
        } else {
            $scope.video = {};
            $scope.newVideo = true;
        }
    };
    
    
    $scope.submitVideo = function() {
        console.log($scope.video);
        
        sendVideo($scope.video, function(response) {
            console.log("Success: " + response);
        });
    };
    
    // Load initial video data implanted by server
    $scope.loadInitVideo();
}]);