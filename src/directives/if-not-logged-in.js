"use strict";

/**
 * @ngdoc directive
 * @name ifNotLoggedIn
 */
angular.module("angular.user.role").directive("ifNotLoggedIn", ["securityService", "ngIfDirective", function(securityService, ngIfDirective) {
    // There can be multiple directives with name "ngIf". Get the Angular's "ngIf" directive.
    var ngIf = ngIfDirective[0];

    return {
        transclude: ngIf.transclude,
        priority: ngIf.priority - 1,
        terminal: ngIf.terminal,
        restrict: "EA",
        link: function($scope, $element, $attr) {
            function checkNotLoggedIn(){
                return !securityService.isLoggedIn();
            }

            securityService._executeDirective(arguments, $scope, $element, $attr, checkNotLoggedIn);
        }
    };
}]);