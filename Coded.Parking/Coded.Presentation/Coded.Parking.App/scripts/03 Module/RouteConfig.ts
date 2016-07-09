module Parking {
    export class RouteConfig {
        constructor($routeProvider: ng.route.IRouteProvider) {
            $routeProvider
                .when("/map", {
                    caseInsensitiveMatch: true, 
                    templateUrl: "/templates/map.html",
                    controller: "mainCtrl"
                })
                .when("/signup", {
                    caseInsensitiveMatch: true,
                    templateUrl: "/templates/signup.html",
                    controller: "signupCtrl"
                })
                .when("/login", {
                    caseInsensitiveMatch: true,
                    templateUrl: "/templates/login.html",
                    controller: "loginCtrl"
                })
                .otherwise({
                    caseInsensitiveMatch: true,
                    templateUrl: "/templates/map.html",
                    controller: "mainCtrl"
                });
        }
    }
    RouteConfig.$inject = ['$routeProvider'];
}