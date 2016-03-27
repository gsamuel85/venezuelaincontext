'use strict';
/* global app, Popcorn */

app.controller("VideoCtrl", ["$scope", "$http", "$location", "$anchorScroll", function videoCtrl($scope, $http, $location, $anchorScroll) {

    // Load video data embedded by server
    $scope.video = JSON.parse(window.video);

    // Store handles for next video popup
    $scope.nextVideoTitle = "Coming up";
    var nextVideoPopup = document.getElementById("next-video-popup");
    // Countdown when transitioning to next video
    var COUNTDOWN_TIME = 5;
    var countdownTimer, paused;
    
    // Store Popcorn controller
    var pop;
    var YT_SETTINGS = "?controls=2&autohide=1&modestbranding=0&theme=dark&autoplay=0";

    $anchorScroll.yOffset = 80;     // Offset when scrolling to comment form / video


    /**
     * Load video in Popcorn element
     */
    var initVideo = function initVideo() {
        var element = Popcorn.HTMLYouTubeVideoElement("#video-main");
        element.src = $scope.video.video_url + YT_SETTINGS;
        pop = new Popcorn(element);

        pop.on("loadeddata", function receivedVideoData() {
            $scope.$apply(function updateDuration() {
                $scope.duration = pop.duration();
            });
        });

        $scope.pop = pop;       // Expose to sub-controllers

        setNextVideo();
    };



    /**
     * Navigate to a selected video
     * @param id _id of the video to navigate to
     */
    $scope.goToVideo = function(id) {
        window.location.assign("/video/" + id);
    };
    $scope.goToNext = function() { $scope.goToVideo(window.nextVideoId); };
    $scope.goToPrev = function() { $scope.goToVideo(window.prevVideoId); };

    /**
     * Seek to a point in the current video, and scroll up to the video
     * @param time
     */
    $scope.videoSeekTo = function videoSeekTo(time) {
        pop.currentTime(time);
        $location.hash("video-main");
        $anchorScroll();
    };



    /**
     * When a video ends, show a popup and navigate to the next video
     */
    var setNextVideo = function setNextVideo() {
        if ($scope.video && $scope.video._id !== window.nextVideoId) {

            // When video duration is known, add an event to show the transition popup
            $http.get('/video/' + window.nextVideoId + '.json').success(function (data) {
                    $scope.nextVideoTitle = data.title;
                    // When video is finished, transition to next video
                    pop.on("ended", function () {
                        initializeCountdown();
                    });
                }
            );
        }
    };

    /**
     * Show popup overlay before transition to the next video
     */
    var showNextVideoPopup = function showNextVideoPopup() {
        nextVideoPopup.style.visibility = "visible";
        $scope.nextVideoVisible = true;
    };
    var hideNextVideoPopup = function hideNextVideoPopup() {
        nextVideoPopup.style.visibility = "hidden";
        $scope.nextVideoVisible = false;
    };

    /**
     * Show the transition popup and begin the countdown
     */
    var initializeCountdown = function initializeCountdown() {
        $scope.timeToNextVideo = COUNTDOWN_TIME;
        showNextVideoPopup();
        startTimer();
        
    };
    var startTimer = function startTimer() {
        countdownTimer = setInterval(function countdown() {
            if (!paused) {
                $scope.$apply(function() {
                    $scope.timeToNextVideo--;
                });
            }

            if ($scope.timeToNextVideo <= 1) {
                $scope.goToNext();
            }
        }, 1000);
    };
    $scope.pauseCountdown = function pauseCountdown() {
        paused = !paused;
    };

    /**
     * Clear countdown interval and popup
     */
    $scope.cancelCountdown = function cancelCountdown() {
        clearInterval(countdownTimer);
        countdownTimer = null;
        paused = false;
        hideNextVideoPopup();
        $scope.timeToNextVideo = COUNTDOWN_TIME;        // Reset in case the user begins again
    };



    /**
     * Set position of timeline triggers
     * @param time
     * @returns style object
     */
    $scope.triggerPositionStyle = function(time) {
        var pc = (((time+1) / $scope.duration) * 100) + "%";
        return {
            left: pc
        };
    };



    // All ready? Load the video
    initVideo();
}]);