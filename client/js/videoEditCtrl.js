'use strict';
/* global app */

app.controller('VideoEditCtrl', ['$scope', '$http', function videoEditCtrl($scope, $http) {

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
     * Send video data to server
     */
    $scope.submitVideo = function submitVideo() {
        $http.post("/video/update", $scope.video).then(
            function onEditSuccess(response) {
                $scope.msg = "Video saved successully";
            },
            function onEditError(err) {
                console.error(err);
            }
        );
    };

    /**
     * Get video URL for preview window
     * @returns {string|*|string}
     */
    $scope.videoUrl = function() {
        return $scope.video.video_url;
    }
    
    // Load initial video data embedded by server
    $scope.loadInitVideo();
}]);