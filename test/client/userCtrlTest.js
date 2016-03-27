'use strict';
/* global inject, expect */

describe('UserCtrl', function() {
    var scope;
    var controller;

    beforeEach(module('vic-app'));

    beforeEach(inject(function($rootScope, $controller) {
        scope = $rootScope.$new();
        controller = $controller('UserCtrl', {
            $scope: scope
        });
    }));
    
    it('should return an image tag with a gravatar url', function() {
        var email = "test@example.com";
        var expectedTag = "<img src='https://s.gravatar.com/avatar/55502f40dc8b7c769880b10874abc9d0?s=100' />";
        expect(scope.getGravatarImage(email)).toEqual(expectedTag);
    });

});