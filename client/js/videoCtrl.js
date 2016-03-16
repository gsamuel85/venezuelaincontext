'use strict';
/* global app, Popcorn */

app.controller("VideoCtrl", ["$scope", "$http", function videoCtrl($scope, $http) {

    // Load video data embedded by server
    $scope.video = JSON.parse(window.video);
    $scope.nextVideoTitle = "Coming up";
    var nextVideoPopup = document.getElementById("next-video-popup");
    
    // Store Popcorn controller
    var pop;
    var YT_SETTINGS = "?controls=2&autohide=1&modestbranding=0&theme=dark&autoplay=0";

    /**
     * Show popup overlay 5 seconds before transition to the next video
     */
    function showNextVideoPopup() {
        nextVideoPopup.style.visibility = "visible";
    }
    $scope.hideNextVideoPopup = function() {
        pop.pause();
        nextVideoPopup.style.visibility = "hidden";
    };

    /**
     * When a video ends, automatically navigate to the next video
     */
    function setNextVideo() {
        if ($scope.video && $scope.video._id !== window.nextVideoId) {
            // When video duration is known, add an event to show the transition popup

            $http.get('/video/' + window.nextVideoId + '.json').
                success(function(data){
                    $scope.nextVideoTitle = data.title;

                    pop.on("durationchange", function() {
                        pop.code({
                            start: pop.duration() - 5,
                            onStart: function(options) { showNextVideoPopup(); }
                        });
                    });

                    // When video is finished, transition to next video
                    pop.on("ended", function () {
                        $scope.goToNext();
                    });
                }
            );
        }
    }

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