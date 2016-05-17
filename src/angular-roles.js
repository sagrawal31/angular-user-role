"use strict";

var rolesApp = angular.module("angular.roles", []);

/**
 * @ngdoc service
 * @name SecurityService
 */
rolesApp.factory("SecurityService", ["$rootScope", function($rootScope) {
    var allRoles, currentUserRoles;

    return {
        /**
         * Check if the
         * @param roles {Array} Check if the user has any of the specified roles.
         * @params userRoles {Array} Optional. Specify any user's roles otherwiser the current user roles set by
         * {loggedIn} method will be used.
         * @returns {boolean} True if the user has any of the specified roles.
         */
        ifAnyGranted: function(roles, userRoles) {
            userRoles = userRoles || currentUserRoles;

            // If either user is not logged in or user don't have any roles
            if (!userRoles || userRoles.length === 0) {
                // The element shouldn't be visible
                return false;
            }

            var ifAnyGranted = false;

            angular.forEach(roles, function(role) {
                if (userRoles.indexOf(role) > -1) {
                    ifAnyGranted = true;
                }
            });

            return ifAnyGranted;
        },
        loggedIn: function(loggedInUserRoles) {
            currentUserRoles = loggedInUserRoles;
        },
        loggedOut: function() {
            currentUserRoles = undefined;
        },
        setRoles: function(roles) {
            allRoles = roles;
        }
    };
}]);

/**
 * @ngdoc directive
 * @name ifAnyGranted
 */
rolesApp.directive("ifAnyGranted", ["SecurityService", "ngIfDirective", function(securityService, ngIfDirective) {
    // There can be multiple directives with name "ngIf". Get the Angular's "ngIf" directive.
    var ngIf = ngIfDirective[0];

    return {
        transclude: ngIf.transclude,
        priority: ngIf.priority - 1,
        terminal: ngIf.terminal,
        restrict: ngIf.restrict,
        link: function($scope, $element, $attr) {
            // If someone uses "if-any-granted" directive along with "ng-if" directive
            var existingNgIf = $attr.ngIf;
            var hasRole = securityService.ifAnyGranted($attr.ifAnyGranted);

            var ifEvaluator;
            if (existingNgIf) {
                ifEvaluator = function () {
                    return $scope.$eval(existingNgIf) && hasRole;
                };
            } else {
                ifEvaluator = function () {
                    return hasRole;
                };
            }

            $attr.ngIf = ifEvaluator;
            ngIf.link.apply(ngIf, arguments);
        }
    };
}]);