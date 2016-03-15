'use strict';
/* global app, Popcorn */

app.controller("VideoCtrl", ["$scope", function videoCtrl($scope) {
    $scope.aMsg = "This is a message from AngularJS";
    
    $scope.video = JSON.parse(window.video);
    
    // Store Popcorn controller
    var pop;
    var YT_SETTINGS = "?controls=2&autohide=1&modestbranding=0&theme=dark&autoplay=0";


    /**
     * Load video in Popcorn element
     */
    function initVideo() {
        var element = Popcorn.HTMLYouTubeVideoElement("#video-main");
        element.src = $scope.video.video_url + YT_SETTINGS;
        pop = new Popcorn(element);
        
        setNextVideo();
    }


    /**
     * When a video ends, automatically navigate to the next video
     */
    function setNextVideo() {
        if (window.nextVideoId) {
            pop.on("ended", function() {
                if ($scope.video && $scope.video._id !== window.nextVideoId) {
                    $scope.goToVideo(window.nextVideoId);
                }
            });
        }
        
    }

    /**
     * Navigate to a selected video
     * @param id _id of the video to navigate to
     */
    $scope.goToVideo = function(id) {
        window.location.assign("/video/" + id);
    };

    $scope.goToNext = function() { $scope.goToVideo(window.nextVideoId); };
    $scope.goToPrev = function() { $scope.goToVideo(window.prevVideoId); };
    
    initVideo();
}]);