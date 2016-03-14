'use strict';
/* global inject, expect */

describe('VideoCtrl', function() {
    var scope;
    var ctrl;

    beforeEach(module('vic-app'));

    beforeEach(inject(function($rootScope, $controller) {
        scope = $rootScope.$new();
        ctrl = $controller('VideoCtrl', {
            $scope: scope
        });
    }));
    
    it('should display test message');;
});