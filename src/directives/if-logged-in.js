"use strict";

/**
 * @ngdoc directive
 * @name ifLoggedIn
 */
angular.module("angular.user.role").directive("ifLoggedIn", ["securityService", function(securityService) {
    var directive = angular.extend({}, securityService._directiveObject());

    directive.link = function($scope, $element, $attr) {
        function checkLoggedIn(){
            return securityService.isLoggedIn();
        }

        securityService._executeDirective(arguments, $scope, $element, $attr, checkLoggedIn);
    };

    return directive;
}]);