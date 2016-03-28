'use strict';
/* global inject, expect */

describe('VideoEditCtrl', function() {
    var scope, controller, $httpBackend;

    beforeEach(module('vic-app'));

    beforeEach(inject(function($injector, $controller) {
        $httpBackend = $injector.get('$httpBackend');
        $httpBackend.when('POST', "/video/update").respond("OK");

        scope = {
            video: {
                _id: 1,
                title: "Test Video",
                subtitle: "This is a test"
            }
        };
        controller = $controller('VideoEditCtrl', {
            $scope: scope
        });
    }));


    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
    
    it('should have a test video', function() {
        expect(scope.video).toBeDefined();
    });

    it('should send a video', function() {
        $httpBackend.expectPOST("/video/update");
        scope.submitVideo();
        $httpBackend.flush();
        expect(scope.msg).toEqual("Video saved successully");
    });
});