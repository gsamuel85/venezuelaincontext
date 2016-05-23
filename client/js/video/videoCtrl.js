'use strict';
/* global Popcorn */

module.exports = function(app){
    app.controller("VideoCtrl", ["$scope", "$http", "$window", "$location", "$anchorScroll", function videoCtrl($scope, $http, $window, $location, $anchorScroll) {

        // Load video data embedded by server
        $scope.video = JSON.parse($window.video);

        // Store handles for next video popup
        $scope.nextVideoTitle = "Coming up";        // Provisional title
        var nextVideoPopup = document.getElementById("next-video-popup");
        // Countdown when transitioning to next video
        var COUNTDOWN_TIME = 5;
        var countdownTimer, paused;

        // Store Popcorn controller
        var YT_SETTINGS = "?controls=2&autohide=1&modestbranding=0&theme=dark&autoplay=1";

        $anchorScroll.yOffset = 80;     // Offset when scrolling to comment form / video


        /**
         * Load video in Popcorn element
         */
        var initVideo = function initVideo() {
            var element = Popcorn.HTMLYouTubeVideoElement("#video-main");
            element.src = $scope.video.video_url + YT_SETTINGS;
            if (!$scope.pop) {
                // Initialise if not already set up (mock)
                $scope.pop = new Popcorn(element);
            }

            $scope.pop.on("loadeddata", function receivedVideoData() {
                $scope.duration = $scope.pop.duration();
            });

            setNextVideo();
        };

        /**
         * When a video ends, show a popup and navigate to the next video
         */
        var setNextVideo = function setNextVideo() {
            if ($scope.video && $scope.video._id !== $window.nextVideoId) {

                // When video duration is known, add an event to show the transition popup
                $http.get('/video/' + $window.nextVideoId + '.json').then(
                    function success(response) {
                        $scope.nextVideoTitle = response.data.title;
                        // When video is finished, transition to next video
                        $scope.pop.on("ended", function () {
                            initializeCountdown();
                        });
                    },
                    function failed(err) {
                        console.error(err);
                    }
                );
            }
        };



        /**
         * Navigate to a selected video
         * @param id _id of the video to navigate to
         */
        $scope.goToVideo = function(id) {
            if (id !== 'unavailable') {
                window.location.assign("/video/" + id);
            }
        };
        $scope.goToNext = function() { $scope.goToVideo(window.nextVideoId); };
        $scope.goToPrev = function() { $scope.goToVideo(window.prevVideoId); };

        /**
         * Seek to a point in the current video, and scroll up to the video
         * @param time
         */
        $scope.videoSeekTo = function videoSeekTo(time) {
            $scope.pop.currentTime(time);
            $location.hash("video-main");
            $anchorScroll();
        };



        /**
         * Show the transition popup and begin the countdown
         */
        var initializeCountdown = function initializeCountdown() {
            $scope.timeToNextVideo = COUNTDOWN_TIME;
            $scope.nextVideoVisible = true;
            startTimer();

        };
        var startTimer = function startTimer() {
            countdownTimer = setInterval(function countdown() {
                if (!paused) {
                    $scope.$apply(function() {
                        $scope.timeToNextVideo--;
                    });
                }

                if ($scope.timeToNextVideo <= 0) {
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
            $scope.nextVideoVisible = false;
            $scope.timeToNextVideo = COUNTDOWN_TIME;        // Reset in case the user begins again
        };



        /**
         * Set position of timeline triggers
         * @param time
         * @returns style object
         */
        $scope.triggerPositionStyle = function(time) {
            // adjust to make sure trigger is aligned with YouTube timeline
            var pc = (((time) / ($scope.duration * 1.01)) * 100) + "%";
            return {
                left: pc
            };
        };


        // All ready? Load the video
        initVideo();
    }]);
};