/// <reference path="../05 Service/ParkingLotService.ts"/>
/// <reference path="../03 Module/TypeDefinitions.ts"/>
/// <reference path="../../Scripts/typings/jqueryui/jqueryui.d.ts"/>
/// <reference path="../../Scripts/typings/GoogleMaps/google.maps.d.ts"/>
/// <reference path="../../Scripts/typings/GoogleMaps/google.maps.cluster.d.ts"/>
var Parking;
(function (Parking) {
    var ParkingMapCtrl = (function () {
        function ParkingMapCtrl($scope, $q, parkingLotService, $compile, $timeout) {
            this.$scope = $scope;
            this.$q = $q;
            this.parkingLotService = parkingLotService;
            this.$compile = $compile;
            this.$timeout = $timeout;
        }
        return ParkingMapCtrl;
    })();
    Parking.ParkingMapCtrl = ParkingMapCtrl;
})(Parking || (Parking = {}));
