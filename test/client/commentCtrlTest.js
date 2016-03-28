'use strict';
/* global inject, expect */

describe('CommentCtrl', function() {
    var scope, controller, $httpBackend, io;

    beforeEach(module('vic-app'));

    beforeEach(inject(function($rootScope, $controller) {
        scope = {
            video: { _id: 1 }
        };

        io = function() {
        }

        controller = $controller('CommentCtrl', {
            $scope: scope
        });
    }));
    
    it('should have an initial comment', function() {
        expect(scope.newComment).toBeDefined();
    });

});