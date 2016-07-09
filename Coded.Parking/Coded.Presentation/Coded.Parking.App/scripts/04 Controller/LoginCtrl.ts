/// <reference path="../05 Service/ParkingLotService.ts"/>
/// <reference path="../03 Module/TypeDefinitions.ts"/>
/// <reference path="../../Scripts/typings/jqueryui/jqueryui.d.ts"/>
/// <reference path="../../Scripts/typings/GoogleMaps/google.maps.d.ts"/>
/// <reference path="../../Scripts/typings/GoogleMaps/google.maps.cluster.d.ts"/>

module Parking {
    export class LoginCtrl {
        constructor(public $scope: LoginCtrlScope, private $q: ng.IQService, private parkingLotService: ParkingLotService, public $window: ng.IWindowService) {
            $scope.userName = '';
            $scope.password = '';
            $scope.loginFail = false;
            if ($window.sessionStorage.getItem("token"))
            {
                parkingLotService.getUserInfo(function (data: Account) {
                    window.location.href = '/#map';
                }, function () { });
            }
        }

        public logout() {
            this.$window.sessionStorage.setItem("token", '');
            window.location.reload();
        }

        public logon() {
            var vm = this;
            vm.$scope.loginFail = false;
            this.parkingLotService.authorize(this.$scope.userName, this.$scope.password, function (data) {
                vm.$window.sessionStorage.setItem("token", data);
                window.location.href = '/#map';
            },
                function () {
                    vm.$scope.loginFail = true;
            });
        }

    }
}
