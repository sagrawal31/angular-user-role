"use strict";

/**
 * @ngdoc directive
 * @name ifAllGranted
 */
angular.module("angular.user.role").directive("ifAllGranted", ["securityService", function(securityService) {
    var directive = angular.extend({}, securityService._directiveObject());

    directive.link = function($scope, $element, $attr) {
        var roles = $attr.ifAllGranted || $attr.roles;
        var roleList = roles.split(",");

        function checkRole(){
            return securityService.ifAllGranted(roleList);
        }

        securityService._executeDirective(arguments, $scope, $element, $attr, checkRole);
    };

    return directive;
}]);