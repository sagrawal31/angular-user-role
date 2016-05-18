"use strict";

/**
 * @ngdoc directive
 * @name ifAnyGranted
 */
angular.module("angular.user.role").directive("ifAnyGranted", ["securityService", "ngIfDirective", function(securityService, ngIfDirective) {
    // There can be multiple directives with name "ngIf". Get the Angular's "ngIf" directive.
    var ngIf = ngIfDirective[0];

    return {
        transclude: ngIf.transclude,
        priority: ngIf.priority - 1,
        terminal: ngIf.terminal,
        restrict: "EA",
        link: function($scope, $element, $attr) {
            var roles = $attr.ifAnyGranted || $attr.roles;
            var roleList = roles.split(",");

            function checkRole(){
                return securityService.ifAnyGranted(roleList);
            }

            securityService._executeDirective(arguments, $scope, $element, $attr, checkRole);
        }
    };
}]);