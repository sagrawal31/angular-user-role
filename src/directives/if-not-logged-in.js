"use strict";

/**
 * @ngdoc directive
 * @name ifNotLoggedIn
 */
angular.module("angular.user.role").directive("ifNotLoggedIn", ["securityService", function(securityService) {
    var directive = angular.extend({}, securityService._directiveObject());

    directive.link = function($scope, $element, $attr) {
        function checkNotLoggedIn(){
            return !securityService.isLoggedIn();
        }

        securityService._executeDirective(arguments, $scope, $element, $attr, checkNotLoggedIn);
    };

    return directive;
}]);