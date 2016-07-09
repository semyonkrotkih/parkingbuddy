module Parking {
    export class SignupCtrl {
        constructor(public $scope: SignupCtrlScope, private $q: ng.IQService, private parkingLotService: Parking.ParkingLotService, private $compile: ng.ICompileService, public $window: ng.IWindowService) {
            $scope.login = '';
            $scope.password = '';
            $scope.repeatPassword = '';
            $scope.firstName = '';
            $scope.lastName = '';
            $scope.email = '';
        }
        public createUser() {
            var model = new SignupViewModel();
            var vm = this;
            this.parkingLotService.createAccount(this.$scope.login, this.$scope.password, this.$scope.firstName, this.$scope.lastName, this.$scope.email, function () {
                vm.parkingLotService.authorize(vm.$scope.login, vm.$scope.password, function (data) {
                    vm.$window.sessionStorage.setItem("token", data);
                    window.location.href = '/app';
                }, function () { });
            }, function () { });
        }

    }
}
