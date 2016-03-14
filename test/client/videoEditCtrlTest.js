'use strict';
/* global inject, expect */

describe('VideoEditCtrl', function() {
    var scope;
    var ctrl;

    beforeEach(module('vic-app'));

    beforeEach(inject(function($rootScope, $controller) {
        scope = $rootScope.$new();
        ctrl = $controller('VideoEditCtrl', {
            $scope: scope
        });
    }));
    
    it('should display test message');
});