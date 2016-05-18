"use strict";

/**
 * @ngdoc service
 * @name securityService
 */
angular.module("angular.user.role").factory("securityService", ["$rootScope", "ngIfDirective",
        function($rootScope, ngIfDirective) {

    var currentUserRoles, isLoggedIn, ngIf = ngIfDirective[0];

    return {
        /**
         * Check if the user has at least one of the given roles.
         *
         * @param roles {Array} Check if the user has any of the specified roles.
         * @params userRoles {Array} Optional. Specify any user's roles otherwiser the current user roles set by
         * {loggedIn} method will be used.
         * @returns {boolean} True if the user has any of the specified roles.
         */
        ifAnyGranted: function(roles, userRoles) {
            userRoles = userRoles || currentUserRoles;

            // If either user is not logged in or user don't have any roles
            if (!userRoles || userRoles.length === 0 || !isLoggedIn) {
                // Then the element shouldn't be visible
                return false;
            }

            var ifAnyGranted = false;

            angular.forEach(roles, function(role) {
                if (userRoles.indexOf(role.trim()) > -1) {
                    ifAnyGranted = true;
                }
            });

            return ifAnyGranted;
        },
        /**
         * Check if the user has all of the given roles.
         *
         * @param roles {Array} Check if the user has all the roles
         * @returns {boolean} True if the user has all the given roles
         */
        ifAllGranted: function(roles, userRoles) {
            userRoles = userRoles || currentUserRoles;

            // If either user is not logged in or user don't have any roles
            if (!userRoles || userRoles.length === 0 || !isLoggedIn) {
                // Then the element shouldn't be visible
                return false;
            }

            var rolesCount = roles.length;
            var availableRolesCount = 0;

            angular.forEach(roles, function(role) {
                if (userRoles.indexOf(role.trim()) > -1) {
                    availableRolesCount++;
                }
            });

            return rolesCount === availableRolesCount;
        },
        isLoggedIn: function() {
            return isLoggedIn;
        },
        loggedIn: function(loggedInUserRoles) {
            isLoggedIn = true;
            currentUserRoles = loggedInUserRoles;
            $rootScope.$broadcast("login.state", {loggedIn: true});
        },
        loggedOut: function() {
            isLoggedIn = false;
            currentUserRoles = undefined;
            $rootScope.$broadcast("login.state", {loggedIn: false});
        },
        /**
         * Internal method to hold common code used across the directives.
         * @param args The "arguments" of the directive
         * @param $scope Scope of the directive
         * @param $element DOM element on which directive is applied
         * @param $attr Attributes passed to the directive
         * @param conditionEvaluator Function which returns the true/false condition based on the directive
         * @private This should not be called explicitly
         */
        _executeDirective: function(args, $scope, $element, $attr, conditionEvaluator) {
            // If someone uses our directive along with "ng-if" directive
            var existingNgIf = $attr.ngIf;
            var condition = conditionEvaluator();

            var ifEvaluator;
            if (existingNgIf) {
                // Merge existing "ng-if" condition
                ifEvaluator = function() {
                    return $scope.$eval(existingNgIf) && condition;
                };
            } else {
                ifEvaluator = function() {
                    return condition;
                };
            }

            $scope.$on("login.state", function() {
                condition = conditionEvaluator();
            });

            $attr.ngIf = ifEvaluator;
            ngIf.link.apply(ngIf, args);
        },
        /**
         * This is private internal method to provide the common structure of the directives provided by this library.
         * @returns {{transclude: *, priority: number, terminal: *, restrict: string}}
         * @private
         */
        _directiveObject: function() {
            return {
                transclude: ngIf.transclude,
                // Execute the directive before the "ng-if" directive on the same element (if any)
                priority: ngIf.priority - 1,
                terminal: ngIf.terminal,
                restrict: "EA",
                // Do not create a new scope, use parent scope
                scope: false
            };
        }
    };
}]);