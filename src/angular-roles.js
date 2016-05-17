var rolesApp = angular.module("angular.roles", []);

/**
 * @ngdoc service
 * @name securityService
 */
rolesApp.factory("securityService", ["$rootScope", function($rootScope) {
    var currentUserRoles;

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

            console.log(roles, userRoles)
            angular.forEach(roles, function(role) {
                if (userRoles.indexOf(role) > -1) {
                    ifAnyGranted = true;
                }
            });

            return ifAnyGranted;
        },
        loggedIn: function(loggedInUserRoles) {
            currentUserRoles = loggedInUserRoles;
            $rootScope.$broadcast("login.state", {loggedIn: true});
        },
        loggedOut: function() {
            currentUserRoles = undefined;
            $rootScope.$broadcast("login.state", {loggedIn: false});
        }
    };
}]);

/**
 * @ngdoc directive
 * @name ifAnyGranted
 */
rolesApp.directive("ifAnyGranted", ["securityService", "ngIfDirective", function(securityService, ngIfDirective) {
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
            var hasRole = false;

            function checkRole(){
                hasRole = securityService.ifAnyGranted($attr.ifAnyGranted.split(","));
            }

            checkRole();

            var ifEvaluator;
            if (existingNgIf) {
                // Merge existing "ng-if" condition
                ifEvaluator = function() {
                    return $scope.$eval(existingNgIf) && hasRole;
                };
            } else {
                ifEvaluator = function() {
                    return hasRole;
                };
            }

            $scope.$on("login.state", function() {
                checkRole();
            });

            $attr.ngIf = ifEvaluator;
            ngIf.link.apply(ngIf, arguments);
        }
    };
}]);