'use strict';

module.exports = function(vicApp) {
    vicApp.controller('CommentEditCtrl', ['$scope', '$http', function CommentEditCtrl($scope, $http) {
        /**
         * Populate scope.comment with embedded data received from server
         */
        $scope.loadInitComment = function loadInitComment() {
            // Is there information about an existing video?
            if (window.commentData) {
                $scope.comment = JSON.parse(window.commentData);
            }
        };


        /**
         * Handle form submission
         * Send comment data to server
         */
        $scope.submitComment = function submitComment() {

            if (!$scope.comment.timeline || $scope.comment.timeline.time === '') {
                $scope.comment.timeline = null;        // Clean timeline field if removed
            }

            $http.post("/comments/update", $scope.comment).then(
                function onEditSuccess(response) {
                    $scope.msg = "Comment saved successully";
                },
                function onEditError(err) {
                    console.error(err);
                }
            );
        };

        // Load initial video data embedded by server
        $scope.loadInitComment();

    }]);
};