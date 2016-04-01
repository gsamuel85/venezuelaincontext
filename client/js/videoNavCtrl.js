'use strict';
/* global app */

app.controller('VideoNavCtrl', ['$scope', '$http', function videoNavCtrl($scope, $http) {

    $scope.videos = [];

    /**
     * Populate scope.video with video data received from server
     */
    var loadVideoData = function loadVideoData() {
        $http.get('/video/all.json').then(
            function success(response) {
                $scope.videos = response.data;
                addImageUrls();
            },
            function error(err) {
                console.error(err);
            }
        );
    };
    
    
    var addImageUrls = function addImageUrls(video) {
        $scope.videos.forEach(function addImageUrl(video) {
            video.imageUrl = "/images/nav/" + video._id + ".jpg";
        });
    };



    // Load initial video data from server
    loadVideoData();
}]);



app.directive('vicNavItem', function() {
    var itemTemplate = 
        "<div class='nav-item' " +
            "ng-click='goToVideo({{videoId}})' " +
            "ng-mouseenter='hoverNav[{{videoId}}] = true' " +
            "ng-mouseleave='hoverNav[{{videoId}}] = false' >" +
            "{{videoId}}" +
            "<img src='../images/nav/{{videoId}}.jpg' class='nav-img'>" +
        "</div>";
    
    return {
        scope: {
            videoId: '=video'
        },
        template: itemTemplate
    };
});