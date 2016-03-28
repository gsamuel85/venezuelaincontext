'use strict';
/* global inject, expect, jasmine */

describe('CommentCtrl', function() {
    var scope, controller, $httpBackend;

    var mockIoService = {
        on: jasmine.createSpy('socket on'),
        emit: jasmine.createSpy('socket emit')
    };
    var mockIo = function mockIo() {
        return mockIoService;
    };

    var mockPop = {
        currentTime: function() { return 100; }
    };

    beforeEach(module('vic-app'));

    beforeEach(inject(function($controller) {
        scope = {
            video: { _id: 1 },
            pop: mockPop
        };

        controller = $controller('CommentCtrl', {
            $scope: scope,
            $socketio: mockIo
        });
    }));
    
    it('should have an initial comment', function() {
        expect(scope.newComment).toBeDefined();
    });

    it('should send a comment', function() {
        scope.sendComment();
        expect(mockIo().emit).toHaveBeenCalled();
    });


    it('should add and remove a timeline time', function() {
        scope.addCommentNow();
        expect (scope.newComment.timeline.time).toBe(100);

        scope.removeNewCommentTime();
        expect (scope.newComment.timeline).toBe(null);
    });

});