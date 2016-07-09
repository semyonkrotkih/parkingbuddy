/// <reference path="../05 Service/ParkingLotService.ts"/>
/// <reference path="../../Scripts/typings/angularjs/angular-route.d.ts"/>
var Parking;
(function (Parking) {
    var Module = (function () {
        function Module(name, modules) {
            this.app = angular.module(name, modules);
            this.app.config(Parking.RouteConfig);
            this.app.config(function ($httpProvider) {
                $httpProvider.interceptors.push('authInterceptor');
            });
        }
        Module.prototype.addController = function (name, controller) {
            this.app.controller(name, controller);
        };
        Module.prototype.addService = function (name, service) {
            this.app.service(name, service);
        };
        Module.prototype.addFactory = function (name, service) {
            this.app.factory(name, service);
        };
        Module.prototype.addDirective = function (name, directive) {
            this.app.directive(name, directive);
        };
        Module.prototype.addFilter = function (name, filter) {
            this.app.filter(name, filter);
        };
        return Module;
    })();
    Parking.Module = Module;
})(Parking || (Parking = {}));
var ParkingApp;
(function (ParkingApp) {
    var app = new Parking.Module('parkingBuddy', ["ngRoute", "ui.bootstrap"]);
    app.addController('mainCtrl', Parking.MainCtrl);
    app.addController('loginCtrl', Parking.LoginCtrl);
    app.addController('signupCtrl', Parking.SignupCtrl);
    app.addService('parkingLotService', Parking.ParkingLotService);
    app.addDirective('parkingMap', Parking.ParkingMapDirective.factory());
    app.addFactory('authInterceptor', new Parking.AuthInterceptor().GetValue);
    app.addFilter('range', Parking.RangeFilter);
})(ParkingApp || (ParkingApp = {}));
//# sourceMappingURL=app.js.map