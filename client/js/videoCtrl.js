'use strict';
/* global app, Popcorn */

app.controller("VideoCtrl", ["$scope", function videoCtrl($scope) {
    $scope.aMsg = "This is a message from AngularJS";
    
    $scope.video = JSON.parse(window.video);
    
    // Store Popcorn controller
    var pop;
    var YT_SETTINGS = "?controls=2&autohide=1&modestbranding=0&theme=dark&autoplay=0";
    
    function initVideo() {
        var element = Popcorn.HTMLYouTubeVideoElement("#video-main");
        element.src = $scope.video.video_url + YT_SETTINGS;
        pop = new Popcorn(element);
        
        setNextVideo();
    }
    
    function setNextVideo() {
        if (window.nextVideoUrl) {
            pop.on("ended", function() {
                window.location.assign(window.nextVideoUrl);
            });
        }
        
    }
    
    initVideo();
}]);