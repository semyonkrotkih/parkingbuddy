/// <reference path="../05 Service/ParkingLotService.ts"/>
/// <reference path="../03 Module/TypeDefinitions.ts"/>
/// <reference path="../../Scripts/typings/jqueryui/jqueryui.d.ts"/>
/// <reference path="../../Scripts/typings/GoogleMaps/google.maps.d.ts"/>
/// <reference path="../../Scripts/typings/GoogleMaps/google.maps.cluster.d.ts"/>
var Parking;
(function (Parking) {
    var MainCtrl = (function () {
        function MainCtrl($scope, $q, parkingLotService, $window, $timeout) {
            var _this = this;
            this.$scope = $scope;
            this.$q = $q;
            this.parkingLotService = parkingLotService;
            this.$window = $window;
            this.$timeout = $timeout;
            $scope.showTopmenuDropdown = false;
            $scope.showSearch = false;
            $scope.mapFunction = new Parking.MapFunction();
            $scope.globalVariables = new Parking.GlobalVariables();
            $scope.mapFunction.editMode = Parking.EditMode.None;
            $scope.mapFunction.selectedParkingLot = null;
            $scope.globalVariables.availabilityReportParking = null;
            $scope.isLoading = true;
            $scope.mapFunction.addingParkingLot = false;
            $scope.mapFunction.showLayer = false;
            $scope.selectedRouteIndex = 0;
            $scope.directions = new Parking.MapDirections();
            this.findParkingNearMe();
            $scope.setFn = function (mapFunction) {
                _this.$scope.$parent.mapFunction = mapFunction;
            };
            $scope.directionsDisplay = new google.maps.DirectionsRenderer({ suppressMarkers: true });
            //$scope.directionsDisplay.setPanel(document.getElementById("directionsPanel"));
            $scope.directionsService = new google.maps.DirectionsService();
            parkingLotService.getAllAddresses(function (data) {
                $scope.addresses = data;
            }, function () { });
            if ($window.sessionStorage.getItem("token")) {
                parkingLotService.getUserInfo(function (data) {
                    $scope.currentUser = data;
                }, function () { });
            }
            $scope.$watch(function () { return $scope.mapFunction.selectedParkingLot; }, function (newValue, oldValue) {
                if (oldValue && newValue && oldValue != newValue && $scope.globalVariables.availabilityReportParking) {
                    $scope.globalVariables.availabilityReportParking = angular.copy(newValue);
                    $scope.globalVariables.availabilityReportParking.AvailablePlaces = -1;
                }
                if (newValue == null) {
                    $scope.globalVariables.availabilityReportParking = null;
                    $scope.mapFunction.editMode = Parking.EditMode.None;
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
        MainCtrl.prototype.findParkingNearMe = function () {
            var _this = this;
            var vm = this;
            if (vm.$scope.mapFunction.editMode != Parking.EditMode.FindParkingNearMe) {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function (position) {
                        _this.parkingLotService.findParkingAround(position.coords.latitude, position.coords.longitude, function (data) {
                            vm.$timeout(function () {
                                vm.$scope.globalVariables.suggestedLots = data;
                                if (data && data.length > 0) {
                                    vm.$scope.mapFunction.editMode = Parking.EditMode.FindParkingNearMe;
                                }
                            });
                        }, function () {
                        });
                    });
                }
            }
            else {
                vm.$scope.mapFunction.editMode = 0;
            }
        };
        MainCtrl.prototype.panToParkingLot = function (parkignLotId) {
            this.$scope.mapFunction.panToParkingLot(parkignLotId, this.$scope);
        };
        MainCtrl.prototype.toggleTopmenuDropdown = function ($event) {
            this.$scope.showTopmenuDropdown = !this.$scope.showTopmenuDropdown;
            $event.stopPropagation();
            $event.preventDefault = true;
        };
        MainCtrl.prototype.toggleSearch = function ($event) {
            this.$scope.showSearch = !this.$scope.showSearch;
            setTimeout(function () { $('#search').select(); }, 500);
            $event.stopPropagation();
            $event.preventDefault = true;
        };
        MainCtrl.prototype.onSearchSelect = function ($item, $model, $label) {
            var vm = this;
            this.$scope.parkingLotFound = $item.StreetName + ($item.ZipCode ? ', ' + $item.ZipCode : '') + ($item.District ? ', ' + $item.District : '') + ($item.City ? ', ' + $item.City : '');
            this.parkingLotService.getBoundsByAddress($item.StreetName, $item.ZipCode, $item.District, $item.City, function (data) {
                vm.$scope.mapBounds = new google.maps.LatLngBounds(new google.maps.LatLng(data.SouthWest.Latitude, data.SouthWest.Longitude), new google.maps.LatLng(data.NorthEast.Latitude, data.NorthEast.Longitude));
            }, function () { });
        };
        MainCtrl.prototype.sendAvailabilityReport = function () {
            var vm = this;
            if (this.$scope.globalVariables.availabilityReportParking && this.$scope.globalVariables.availabilityReportParking.AvailablePlaces >= 0) {
                this.parkingLotService.reportAvailability(this.$scope.globalVariables.availabilityReportParking.Id, this.$scope.globalVariables.availabilityReportParking.AvailablePlaces, this.$scope.globalVariables.availabilityReportParking.IsReportApproximate, function () {
                    vm.$timeout(function () {
                        vm.$scope.suggestedParkingShowReceipt = true;
                    }, 0);
                    vm.$timeout(function () {
                        vm.$scope.globalVariables.availabilityReportParking = null;
                        vm.$scope.mapFunction.editMode = Parking.EditMode.None;
                        vm.$scope.suggestedParkingShowReceipt = false;
                    }, 5000);
                }, function () {
                    alert("Server error!");
                });
            }
        };
        MainCtrl.prototype.setDirectiveFn = function (mapFunctions) {
            this.$scope.mapFunction = mapFunctions;
        };
        MainCtrl.prototype.logout = function () {
            this.$window.sessionStorage.setItem("token", '');
            window.location.reload();
        };
        MainCtrl.prototype.getUserInfo = function () {
        };
        MainCtrl.prototype.calculateRoute = function ($event) {
            var _this = this;
            if (this.$scope.mapFunction.selectedParkingLot) {
                var vm = this;
                this.$scope.mapFunction.getMyLocation(this.$scope.mapFunction.map, function (myLocattion) {
                    var end = new google.maps.LatLng(_this.$scope.mapFunction.selectedParkingLot.Latitude, _this.$scope.mapFunction.selectedParkingLot.Longitude);
                    var request = {
                        origin: new google.maps.LatLng(myLocattion.latitude, myLocattion.longitude),
                        destination: end,
                        provideRouteAlternatives: true,
                        travelMode: google.maps.TravelMode.DRIVING
                    };
                    _this.$scope.directionsService.route(request, function (result, status) {
                        if (status == google.maps.DirectionsStatus.OK) {
                            vm.removeRoutes(vm);
                            for (var i = 0; i < result.routes.length; i++) {
                                if (i == 0) {
                                    vm.$scope.mapFunction.map.fitBounds(result.routes[i].bounds);
                                }
                                vm.drawRoute(result.routes[i].overview_path, i, vm.$scope);
                                vm.$scope.directions.directionRoutes.push(result.routes[i]);
                            }
                            vm.$timeout(function () {
                                vm.$scope.mapFunction.editMode = Parking.EditMode.SelectRoute;
                            });
                        }
                    });
                });
            }
        };
        MainCtrl.prototype.removeRoutes = function (vm) {
            if (vm.$scope.directions.routePolylines) {
                for (var i = 0; i < vm.$scope.directions.routePolylines.length; i++) {
                    vm.$scope.directions.routePolylines[i].setMap(null);
                }
            }
            vm.$scope.directions.routePolylines = [];
            vm.$scope.directions.directionRoutes = [];
        };
        MainCtrl.prototype.drawRoute = function (points, idx, scope) {
            var color = idx == 0 ? '#4CAF50' : '#333333';
            var opacity = idx == 0 ? 1.0 : 0.5;
            var zIndex = idx == 0 ? 10000 : 0;
            var vm = this;
            var routLine = new google.maps.Polyline({
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
        };
        MainCtrl.prototype.markSelectedRoute = function (scope, index) {
            for (var i = 0; i < scope.directions.routePolylines.length; i++) {
                if (index == scope.directions.routePolylines[i].index) {
                    scope.directions.routePolylines[i].setOptions({
                        zIndex: 10000,
                        strokeColor: '#4CAF50',
                        strokeOpacity: 1
                    });
                }
                else {
                    scope.directions.routePolylines[i].setOptions({
                        zIndex: 0,
                        strokeColor: '#333333',
                        strokeOpacity: 0.5
                    });
                }
            }
            scope.selectedRouteIndex = index;
        };
        MainCtrl.prototype.toggleGoToMyLocation = function ($event) {
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
                }, function (x) {
                    alert('error' + x);
                });
            }
            $event.stopPropagation();
            $event.preventDefault = true;
        };
        MainCtrl.prototype.toggleAddParkingLot = function ($event) {
            this.$scope.mapFunction.addingParkingLot = !this.$scope.mapFunction.addingParkingLot;
            $event.stopPropagation();
            $event.preventDefault = true;
        };
        MainCtrl.prototype.toggleShowLayer = function ($event) {
            this.$scope.mapFunction.showLayer = !this.$scope.mapFunction.showLayer;
            $event.stopPropagation();
            $event.preventDefault = true;
        };
        MainCtrl.prototype.reportAvailability = function ($event) {
            var vm = this;
            vm.$timeout(function () {
                vm.$scope.mapFunction.editMode = Parking.EditMode.ReportAvailability;
                vm.$scope.globalVariables.availabilityReportParking = angular.copy(vm.$scope.mapFunction.selectedParkingLot);
                vm.$scope.globalVariables.availabilityReportParking.AvailablePlaces = -1;
                vm.$scope.mapFunction.panToParkingLot(vm.$scope.mapFunction.selectedParkingLot.Id, vm.$scope);
            });
            $event.stopPropagation();
            $event.preventDefault = true;
        };
        return MainCtrl;
    })();
    Parking.MainCtrl = MainCtrl;
})(Parking || (Parking = {}));
//# sourceMappingURL=MainCtrl.js.map