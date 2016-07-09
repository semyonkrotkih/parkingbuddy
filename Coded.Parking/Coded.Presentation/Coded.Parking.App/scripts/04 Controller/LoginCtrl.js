/// <reference path="../05 Service/ParkingLotService.ts"/>
/// <reference path="../03 Module/TypeDefinitions.ts"/>
/// <reference path="../../Scripts/typings/jqueryui/jqueryui.d.ts"/>
/// <reference path="../../Scripts/typings/GoogleMaps/google.maps.d.ts"/>
/// <reference path="../../Scripts/typings/GoogleMaps/google.maps.cluster.d.ts"/>
var Parking;
(function (Parking) {
    var LoginCtrl = (function () {
        function LoginCtrl($scope, $q, parkingLotService, $window) {
            this.$scope = $scope;
            this.$q = $q;
            this.parkingLotService = parkingLotService;
            this.$window = $window;
            $scope.userName = '';
            $scope.password = '';
            $scope.loginFail = false;
            if ($window.sessionStorage.getItem("token")) {
                parkingLotService.getUserInfo(function (data) {
                    window.location.href = '/#map';
                }, function () { });
            }
        }
        LoginCtrl.prototype.logout = function () {
            this.$window.sessionStorage.setItem("token", '');
            window.location.reload();
        };
        LoginCtrl.prototype.logon = function () {
            var vm = this;
            vm.$scope.loginFail = false;
            this.parkingLotService.authorize(this.$scope.userName, this.$scope.password, function (data) {
                vm.$window.sessionStorage.setItem("token", data);
                window.location.href = '/#map';
            }, function () {
                vm.$scope.loginFail = true;
            });
        };
        return LoginCtrl;
    })();
    Parking.LoginCtrl = LoginCtrl;
})(Parking || (Parking = {}));
//# sourceMappingURL=LoginCtrl.js.map