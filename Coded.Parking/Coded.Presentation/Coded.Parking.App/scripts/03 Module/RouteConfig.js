var Parking;
(function (Parking) {
    var RouteConfig = (function () {
        function RouteConfig($routeProvider) {
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
        return RouteConfig;
    })();
    Parking.RouteConfig = RouteConfig;
    RouteConfig.$inject = ['$routeProvider'];
})(Parking || (Parking = {}));
//# sourceMappingURL=RouteConfig.js.map