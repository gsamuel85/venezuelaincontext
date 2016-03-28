'use strict';
/* global app */

app.controller('VideoEditCtrl', ['$scope', '$http', function videoCtrl($scope, $http) {

    /**
     * Send video data to server
     * @param video
     * @param callback
     */
    function sendVideo(video, callback) {
        $http.post("/video/update", $scope.video).then(
            function onEditSuccess(response) {
                callback(response.data);
            },
            function onEditError(err) {
                console.error(err);
            }
        );
    }

    /**
     * Populate scope.video with embedded data received from server
     */
    $scope.loadInitVideo = function loadInitVideo() {
        // Is there information about an existing video?
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
                $scope.msg = "Video saved successully";
            }
            else {
                console.log(response);
            }
        });
    };
    
    // Load initial video data embedded by server
    $scope.loadInitVideo();
}]);