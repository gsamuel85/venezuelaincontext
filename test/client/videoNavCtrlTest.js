'use strict';
/* global inject, expect */

describe('VideoNavCtrl', function() {
    var scope, controller, $httpBackend;

    var testVideos = [
        { _id: 1, title: "Test Video 1" },
        { _id: 2, title: "Test Video 2" },
        { _id: 3, title: "Test Video 3" }
    ];


    beforeEach(module('vic-app'));

    beforeEach(inject(function($injector, $controller) {
        $httpBackend = $injector.get('$httpBackend');
        $httpBackend.when('GET', "/video/all.json").respond(testVideos);

        scope = {};
        controller = $controller('VideoNavCtrl', {
            $scope: scope
        });
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
    
    it('should load videos from the server', function() {
        expect(scope.videos).toBeDefined();     // Loaded correctly
        
        $httpBackend.expectGET('/video/all.json');
        $httpBackend.flush();
        expect(scope.videos.length).toEqual(testVideos.length);
        expect(scope.hoverNav.length).toEqual(scope.videos.length + 1);
    });

});

describe('Nav Item Directive', function() {
    var $compile, $rootScope, element;

    beforeEach(module('vic-app'));

    beforeEach(inject(function(_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));

    beforeEach(function() {
        element = $compile("<div vic-nav-item video='1'></div>")($rootScope);
        $rootScope.$digest();
    });

    it('should create a nav item div', function() {
        expect(element.html()).toContain('<div class="nav-item');
    });

    it('should have an image URL for each video', function() {
        expect(element.html()).toContain('<img src="../images/nav/1.jpg"');
    });
});