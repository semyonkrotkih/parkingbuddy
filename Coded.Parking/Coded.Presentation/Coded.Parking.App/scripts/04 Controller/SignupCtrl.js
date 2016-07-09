var Parking;
(function (Parking) {
    var SignupCtrl = (function () {
        function SignupCtrl($scope, $q, parkingLotService, $compile, $window) {
            this.$scope = $scope;
            this.$q = $q;
            this.parkingLotService = parkingLotService;
            this.$compile = $compile;
            this.$window = $window;
            $scope.login = '';
            $scope.password = '';
            $scope.repeatPassword = '';
            $scope.firstName = '';
            $scope.lastName = '';
            $scope.email = '';
        }
        SignupCtrl.prototype.createUser = function () {
            var model = new Parking.SignupViewModel();
            var vm = this;
            this.parkingLotService.createAccount(this.$scope.login, this.$scope.password, this.$scope.firstName, this.$scope.lastName, this.$scope.email, function () {
                vm.parkingLotService.authorize(vm.$scope.login, vm.$scope.password, function (data) {
                    vm.$window.sessionStorage.setItem("token", data);
                    window.location.href = '/app';
                }, function () { });
            }, function () { });
        };
        return SignupCtrl;
    })();
    Parking.SignupCtrl = SignupCtrl;
})(Parking || (Parking = {}));
//# sourceMappingURL=SignupCtrl.js.map