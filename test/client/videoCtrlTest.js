'use strict';
/* global jasmine */

describe('VideoCtrl', function() {
    var scope, controller, $httpBackend;

    var testVideo = {
        _id: 1,
        title: "Test Video",
        video_url: "test_video_url"
    };
    var nextVideo = {
        _id: 2,
        title: "Next Video"
    };
    var mockWindow = {
        video: JSON.stringify(testVideo),
        nextVideoId: nextVideo._id
    };

    var mockPop = {
        time: 0,
        currentTime: function(time) { 
            if (!time) { return this.time }
            else { this.time = time; }
        },
        on: jasmine.createSpy('pop event').and.
                callFake(function(event, callback) {
                    callback();
            }),
        duration: jasmine.createSpy('pop duration').and.
                callFake(function() {
                    return 100;
            })
    };


    beforeEach(module('vic-app'));

    beforeEach(inject(function($injector, $controller) {
        $httpBackend = $injector.get('$httpBackend');
        $httpBackend.when('GET', '/video/' + nextVideo._id + '.json').respond(nextVideo);

        scope = {
            pop: mockPop
        };

        controller = $controller('VideoCtrl', {
            $scope: scope,
            $window: mockWindow
        });
    }));


    it('should load video data from embedded data', function() {
        expect(scope.video).toBeDefined();
        expect(scope.video).toEqual(testVideo);
    });

    it('should initialise Popcorn controller', function() {
        expect(scope.pop.duration()).toBe(100);
        expect(mockPop.on).toHaveBeenCalled();
    });

    it('should seek to the specified time', function() {
        scope.videoSeekTo(25);
        expect(scope.pop.currentTime()).toBe(25);
    });

    it('should load data for the next video', function() {
        $httpBackend.expectGET('/video/' + nextVideo._id + '.json');
        $httpBackend.flush();
        expect(scope.nextVideoTitle).toEqual(nextVideo.title);
    });

    it('should create a style object to place timeline triggers', function() {
        var pos = scope.triggerPositionStyle(25);
        expect(pos).toEqual({ left: "25%"});
    });
});