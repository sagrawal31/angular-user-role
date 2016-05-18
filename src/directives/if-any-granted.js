"use strict";

/**
 * @ngdoc directive
 * @name ifAnyGranted
 */
angular.module("angular.user.role").directive("ifAnyGranted", ["securityService", function(securityService) {
    var directive = angular.extend({}, securityService._directiveObject());

    directive.link = function($scope, $element, $attr) {
        var roles = $attr.ifAnyGranted || $attr.roles;
        var roleList = roles.split(",");

        function checkRole(){
            return securityService.ifAnyGranted(roleList);
        }

        securityService._executeDirective(arguments, $scope, $element, $attr, checkRole);
    };

    return directive;
}]);