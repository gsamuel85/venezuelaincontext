/**
 * Created by Guy on 22/5.
 */
'use strict';

module.exports = function(app) {
    app.directive('vicNavItem', ['$compile', function($compile) {
        var getTemplate = function getTemplate(id) {
            return "<div class='nav-item' " +
                "ng-click='goToVideo(" + id + ")' " +
                "ng-mouseenter='hoverNav[" + id + "] = true' " +
                "ng-mouseleave='hoverNav[" + id + "] = (video._id == " + id + ")' >" +
                "<img src='../images/nav/" + id + ".jpg' ng-show='hoverNav[" + id + "]' class='nav-img' alt='{{videos[" + id + "].title}}'>" +
                "</div>";
        };

        return {
            restrict: 'AE',
            template: function(element, attrs) {
                return getTemplate(attrs.video);
            }
        };
    }]);
};