'use strict';
/* global inject, expect */

describe('UserCtrl', function() {
    var scope;
    var controller;

    beforeEach(module('userApp'));

    beforeEach(inject(function($rootScope, $controller) {
        scope = $rootScope.$new();
        controller = $controller('UserCtrl', {
            $scope: scope
        });
    }));
    
    it('should validate password criteria');

});