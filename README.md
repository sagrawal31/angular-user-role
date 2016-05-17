# Angular User Role

Insired by Grails [Spring Security Core](http://grails.org/plugin/spring-security-core) plugin concept of roles and [TagLib](http://grails-plugins.github.io/grails-spring-security-core/v2/guide/helperClasses.html#securityTagLib).

This library provides a simple vanilla access control for your Angular application. By definition role is named set of
abilities (permissions) by which specific group of users is identified. Role names can be like `ROLE_ADMIN`,
`ROLE_ORGANIZATION_MANAGER` or `roleAccountant`.

## Usage

1. Install via Bower

    bower install angular-user-role --save

2. Add the script to your main HTML file (like `index.html`)

    <script src="bower_components/angular-user-role/dist/angular-user-role.min.js"></script>

3. Add dependency to your application

    var myApp = angular.module("foo", ["angular.user.role", "others"]);

4. In your application, when a user logs in or logs out, do the following:

```
myApp.controller("LoginController", ["$scope", "$http", "securityService", function($scope, $http, securityService) {

    $scope.doLogin = function() {
        $http.post('/api/login', {username: "foo", password: "bar"}).then(function(resp) {
            // Successfully logged in

            // Notify the security service that current logged in user following roles where roles should be an array
             of string like: ["ROLE_ADMIN", "ROLE_ORGANIZATION_MANAGER"]
            securityService.loggedIn(resp.data.roles);
        });
    };

    $scope.logout = function() {
        $http.post('/api/logout').then(function() {
            // Successfully logged out

            // Notify the security service that user has logged out
            securityService.loggedOut();
        });
    };
}]);
```

5. Now use it in your HTML

#### if-any-granted

Displays the element content if at least one of the listed roles are granted to the current logged in user.

```
    <div class="thumbnail" if-any-granted="ROLE_ADMIN,ROLE_USER">
        <-- Your content here -->
    </div>
```

*If the user is not logged in then the content will be hidden/removed*

In the above all directives, the behaviour of `ng-if` directive is used i.e. if any of the roles based authentication
results in `false` then the respective DOM element will be removed from the DOM.

## Development & Contributions

Pull requests are welcome :-)

## Releasing new version

```
grunt uglify
grunt bump:patch
```