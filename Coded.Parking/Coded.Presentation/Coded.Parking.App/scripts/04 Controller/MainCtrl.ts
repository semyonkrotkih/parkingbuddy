/// <reference path="../05 Service/ParkingLotService.ts"/>
/// <reference path="../03 Module/TypeDefinitions.ts"/>
/// <reference path="../../Scripts/typings/jqueryui/jqueryui.d.ts"/>
/// <reference path="../../Scripts/typings/GoogleMaps/google.maps.d.ts"/>
/// <reference path="../../Scripts/typings/GoogleMaps/google.maps.cluster.d.ts"/>

module Parking {
    export class MainCtrl {
        constructor(public $scope: IMainCtrlScope, private $q: ng.IQService, private parkingLotService: ParkingLotService, public $window: ng.IWindowService, public $timeout: ng.ITimeoutService) {
            $scope.showTopmenuDropdown = false;
            $scope.showSearch = false;
            $scope.mapFunction = new MapFunction();
            $scope.globalVariables = new GlobalVariables();
            $scope.mapFunction.editMode = EditMode.None;
            $scope.mapFunction.selectedParkingLot = null;
            $scope.globalVariables.availabilityReportParking = null;
            $scope.isLoading = true;
            $scope.mapFunction.addingParkingLot = false;
            $scope.mapFunction.showLayer = false;
            $scope.selectedRouteIndex = 0;
            $scope.directions = new MapDirections();
            this.findParkingNearMe();
            $scope.setFn = (mapFunction: MapFunction) =>
            {
                (<IMainCtrlScope>this.$scope.$parent).mapFunction = mapFunction;
            };
            $scope.directionsDisplay = new google.maps.DirectionsRenderer({ suppressMarkers: true });
            //$scope.directionsDisplay.setPanel(document.getElementById("directionsPanel"));

            $scope.directionsService = new google.maps.DirectionsService();
            parkingLotService.getAllAddresses((data: Address[]) =>
            {
                $scope.addresses = data;
            }, () => { });
            if ($window.sessionStorage.getItem("token")) {
                parkingLotService.getUserInfo((data: Account) =>
                {
                    $scope.currentUser = data;
                }, () => { });
            }
            $scope.$watch(() => $scope.mapFunction.selectedParkingLot, (newValue: ParkingLot, oldValue: ParkingLot) => {
                if (oldValue && newValue && oldValue != newValue && $scope.globalVariables.availabilityReportParking) {
                    $scope.globalVariables.availabilityReportParking = angular.copy(newValue);
                    $scope.globalVariables.availabilityReportParking.AvailablePlaces = -1;
                }
                if (newValue == null)
                {
                    $scope.globalVariables.availabilityReportParking = null;
                    $scope.mapFunction.editMode = EditMode.None;
                }
            });
            // Click anywhere else will hide the dropdowns
            angular.element(document).click(function (event) {
                //if (angular.element(event.target).closest('.top-menu').length == 0) {
                $scope.showTopmenuDropdown = false;
                //}
                $scope.$apply();
            });
        }

        public findParkingNearMe()
        {
            var vm = this;
            if (vm.$scope.mapFunction.editMode != EditMode.FindParkingNearMe) {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition((position) => {
                        this.parkingLotService.findParkingAround(position.coords.latitude, position.coords.longitude,
                            (data: any[]) => {
                                vm.$timeout(() => {
                                    vm.$scope.globalVariables.suggestedLots = data;
                                    if (data && data.length > 0) {
                                        vm.$scope.mapFunction.editMode = EditMode.FindParkingNearMe;
                                    }
                                });
                            },
                            () => {
                            });
                    });
                }
            }
            else
            {
                vm.$scope.mapFunction.editMode = 0;
            }
        }

        public panToParkingLot(parkignLotId: number)
        {
            this.$scope.mapFunction.panToParkingLot(parkignLotId, this.$scope);
        }
        
        public toggleTopmenuDropdown($event)
        {
            this.$scope.showTopmenuDropdown = !this.$scope.showTopmenuDropdown;
            $event.stopPropagation();
            $event.preventDefault = true;
        }

        public toggleSearch($event)
        {
            this.$scope.showSearch = !this.$scope.showSearch;
            setTimeout(function () { $('#search').select(); }, 500);            
            $event.stopPropagation();
            $event.preventDefault = true;
        }

        public onSearchSelect($item: Address, $model, $label)
        {
            var vm = this;
            this.$scope.parkingLotFound = $item.StreetName + ($item.ZipCode ? ', ' + $item.ZipCode : '') + ($item.District ? ', ' + $item.District : '') + ($item.City ? ', ' + $item.City : '');
            this.parkingLotService.getBoundsByAddress($item.StreetName, $item.ZipCode, $item.District, $item.City,
                function (data)
                {
                    vm.$scope.mapBounds = new google.maps.LatLngBounds(new google.maps.LatLng(data.SouthWest.Latitude, data.SouthWest.Longitude), new google.maps.LatLng(data.NorthEast.Latitude, data.NorthEast.Longitude));
                },
                function () { }
                );
        }

        public sendAvailabilityReport()
        {
            var vm = this;
            if (this.$scope.globalVariables.availabilityReportParking && this.$scope.globalVariables.availabilityReportParking.AvailablePlaces >= 0) {
                this.parkingLotService.reportAvailability(this.$scope.globalVariables.availabilityReportParking.Id, this.$scope.globalVariables.availabilityReportParking.AvailablePlaces, this.$scope.globalVariables.availabilityReportParking.IsReportApproximate,
                    () => {
                        vm.$timeout(() => {
                            vm.$scope.suggestedParkingShowReceipt = true;
                        },0);
                        vm.$timeout(() => {
                            vm.$scope.globalVariables.availabilityReportParking = null;
                            vm.$scope.mapFunction.editMode = EditMode.None;
                            vm.$scope.suggestedParkingShowReceipt = false;
                        }, 5000);
                    },
                    () => {
                        alert("Server error!");
                    });
            }
        }

        public setDirectiveFn(mapFunctions: MapFunction)
        {
            this.$scope.mapFunction = mapFunctions;
        }

        public logout() {
            this.$window.sessionStorage.setItem("token", '');
            window.location.reload();
        }

        public getUserInfo() {
            
        }

        public calculateRoute($event) {
            if (this.$scope.mapFunction.selectedParkingLot) {
                var vm = this;
                this.$scope.mapFunction.getMyLocation(this.$scope.mapFunction.map, (myLocattion: Coordinates) => {
                    var end = new google.maps.LatLng(this.$scope.mapFunction.selectedParkingLot.Latitude, this.$scope.mapFunction.selectedParkingLot.Longitude);

                    var request = {
                        origin: new google.maps.LatLng(myLocattion.latitude, myLocattion.longitude),
                        destination: end,
                        provideRouteAlternatives: true,
                        travelMode: google.maps.TravelMode.DRIVING
                    };
                    this.$scope.directionsService.route(request, function (result: google.maps.DirectionsResult, status) {
                        if (status == google.maps.DirectionsStatus.OK) {
                            vm.removeRoutes(vm);
                            for (var i = 0; i < result.routes.length; i++)
                            {
                                if (i == 0)
                                {
                                    vm.$scope.mapFunction.map.fitBounds(result.routes[i].bounds);
                                }
                                vm.drawRoute(result.routes[i].overview_path, i, vm.$scope);
                                vm.$scope.directions.directionRoutes.push(result.routes[i]);
                            }
                            vm.$timeout(function () {
                                vm.$scope.mapFunction.editMode = EditMode.SelectRoute;
                            });
                        }
                    });
                });
            }
        }

        public removeRoutes(vm: MainCtrl)
        {
            if (vm.$scope.directions.routePolylines) {
                for (var i = 0; i < vm.$scope.directions.routePolylines.length; i++) {
                    vm.$scope.directions.routePolylines[i].setMap(null);
                }
            }
            vm.$scope.directions.routePolylines = [];
            vm.$scope.directions.directionRoutes = [];
        }

        public drawRoute(points: google.maps.LatLng[], idx: number, scope: IMainCtrlScope) {
            var color = idx == 0 ? '#4CAF50' : '#333333';
            var opacity = idx == 0 ? 1.0 : 0.5;
            var zIndex = idx == 0 ? 10000 : 0;
            var vm = this;
            var routLine = new google.maps.Polyline(
                {
                    path: points,
                    strokeColor: color,
                    strokeOpacity: opacity,
                    strokeWeight: 10,
                    zIndex: zIndex,
                    index: idx
                });
            scope.directions.routePolylines.push(routLine);
            routLine.setMap(scope.mapFunction.map);

            // Add a listener for the rightclick event on the routLine
            google.maps.event.addListener(routLine, 'click', function () {
                vm.markSelectedRoute(scope, this.index);
            });
        }

        public markSelectedRoute(scope: IMainCtrlScope, index: number)
        {
            for (var i = 0; i < scope.directions.routePolylines.length; i++) {
                if (index == (<any>scope.directions.routePolylines[i]).index) {
                    scope.directions.routePolylines[i].setOptions(
                        {
                            zIndex: 10000,
                            strokeColor: '#4CAF50',
                            strokeOpacity: 1
                        });
                }
                else {
                    scope.directions.routePolylines[i].setOptions(
                        {
                            zIndex: 0,
                            strokeColor: '#333333',
                            strokeOpacity: 0.5
                        });
                }
            }
            scope.selectedRouteIndex = index;
        }

        public toggleGoToMyLocation($event) {
            var map = this.$scope.mapFunction.map;
            // Try HTML5 geolocation.
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    var location = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    var locattionLatLng = new google.maps.LatLng(location.lat, location.lng);
                    map.panTo(locattionLatLng);
                    map.setZoom(18);
                }
                    , function (x) {
                        alert('error' + x);
                    });
            }
            $event.stopPropagation();
            $event.preventDefault = true;
        }

        public toggleAddParkingLot($event) {
            this.$scope.mapFunction.addingParkingLot = !this.$scope.mapFunction.addingParkingLot;
            $event.stopPropagation();
            $event.preventDefault = true;
        }

        public toggleShowLayer($event) {
            this.$scope.mapFunction.showLayer = !this.$scope.mapFunction.showLayer;
            $event.stopPropagation();
            $event.preventDefault = true;
        }

        public reportAvailability($event) {
            var vm = this;
            vm.$timeout(function () {
                vm.$scope.mapFunction.editMode = EditMode.ReportAvailability;
                vm.$scope.globalVariables.availabilityReportParking = angular.copy(vm.$scope.mapFunction.selectedParkingLot);
                vm.$scope.globalVariables.availabilityReportParking.AvailablePlaces = -1;
                vm.$scope.mapFunction.panToParkingLot(vm.$scope.mapFunction.selectedParkingLot.Id, vm.$scope);
            });
            $event.stopPropagation();
            $event.preventDefault = true;
        }

    }
}
