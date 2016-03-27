'use strict';
/* global inject, expect */

describe('CommentCtrl', function() {
    var scope;
    var controller;

    beforeEach(module('vic-app'));

    beforeEach(inject(function($rootScope, $controller) {
        scope = $rootScope.$new();
        controller = $controller('CommentCtrl', {
            $scope: scope
        });
    }));
    
    it('should have an initial comment', function() {
        expect(scope.newComment).toBeDefined();
    });

});