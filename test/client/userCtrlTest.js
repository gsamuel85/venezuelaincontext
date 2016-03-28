'use strict';
/* global inject, expect */

describe('UserCtrl', function() {
    var scope, controller, form;

    beforeEach(module('userApp'));

    beforeEach(inject(function($rootScope, $controller, $compile) {
        scope = $rootScope;

        var formElement = angular.element(
            '<form name="form">' +
                '<input type="password" name="password" ng-model="password" password />' +
            '</form>'
        );

        scope.model = { password: "" };
        $compile(formElement)(scope);
        form = scope.form;

        controller = $controller('UserCtrl', {
            $scope: scope
        });
    }));


    it('initial password should be empty and valid', function() {
        expect(scope.password).toBe("");
        expect(form.password.$valid).toBe(true);
    });

    it('should reject a short password', function() {
        form.password.$setViewValue("12345");
        scope.$digest();
        expect(form.password.$valid).toBe(false);
    });

    it('should accept a password with 8 characters', function() {
        form.password.$setViewValue("12345678");
        scope.$digest();
        expect(form.password.$valid).toBe(true);
    });

});