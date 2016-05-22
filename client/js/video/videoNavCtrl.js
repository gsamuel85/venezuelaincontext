'use strict';

module.exports = function(app) {
    app.controller('VideoNavCtrl', ['$scope', '$http', function videoNavCtrl($scope, $http) {

        $scope.videos = [];
        $scope.hoverNav = [];       // Which video is being hovered over?

        /**
         * Populate scope.video with video data received from server
         */
        var loadVideoData = function loadVideoData() {
            $http.get('/video/all.json').then(
                function success(response) {
                    $scope.videos = response.data;

                    // Hide all video images except current video
                    $scope.hoverNav = Array.apply(null, new Array($scope.videos.length + 1)).map(function() { return false;} );
                    $scope.hoverNav[$scope.video._id] = true;
                },
                function error(err) {
                    console.error(err);
                }
            );
        };

        var showNavImage = function showNavImage(id) {
            $scope.hoverNav[id] = true;
        };
        var hideNavImage = function hideNavImage(id) {
            if (id !== $scope.video._id) {
                $scope.hoverNav[id] = false;
            }
        };

        // Load initial video data from server
        loadVideoData();
    }]);

};