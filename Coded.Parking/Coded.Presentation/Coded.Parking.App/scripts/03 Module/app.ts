/// <reference path="../05 Service/ParkingLotService.ts"/>
/// <reference path="../../Scripts/typings/angularjs/angular-route.d.ts"/>

module Parking
{
    export class Module {
        app: ng.IModule;

        constructor(name: string, modules: Array<string>) {
            this.app = angular.module(name, modules);
            this.app.config(Parking.RouteConfig);
            this.app.config(function ($httpProvider) {
                $httpProvider.interceptors.push('authInterceptor');
            });
        }

        addController(name: string, controller: Function) {
            this.app.controller(name, controller);
        }
        addService(name: string, service: Function) {
            this.app.service(name, service);
        }
        addFactory(name: string, service: Function) {
            this.app.factory(name, service);
        }
        addDirective(name: string, directive: ng.IDirectiveFactory) {
            this.app.directive(name, directive);
        }
        addFilter(name: string, filter: Function) {
            this.app.filter(name, filter);
        }
    }
}

module ParkingApp {
    var app = new Parking.Module('parkingBuddy', ["ngRoute", "ui.bootstrap"]);
    app.addController('mainCtrl', Parking.MainCtrl);
    app.addController('loginCtrl', Parking.LoginCtrl);
    app.addController('signupCtrl', Parking.SignupCtrl);
    app.addService('parkingLotService', Parking.ParkingLotService);
    app.addDirective('parkingMap', Parking.ParkingMapDirective.factory());
    app.addFactory('authInterceptor', new Parking.AuthInterceptor().GetValue);
    app.addFilter('range', Parking.RangeFilter);
}