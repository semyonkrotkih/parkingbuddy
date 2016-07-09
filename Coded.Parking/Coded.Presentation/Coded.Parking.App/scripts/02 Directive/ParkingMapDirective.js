var Parking;
(function (Parking) {
    var ParkingMapDirective = (function () {
        function ParkingMapDirective(parkingLotService, $parse, $compile, $q, $timeout) {
            var _this = this;
            this.parkingLotService = parkingLotService;
            this.$parse = $parse;
            this.$compile = $compile;
            this.$q = $q;
            this.$timeout = $timeout;
            this.scope = false; //{ setFn: '&', mapClick: '&', addingParkingLot: '=', mapBounds: '=', map: '=', isLoading: '=', showLayer: '=', selectedParkingLot: '=', getMyLocation: '='};
            this.parkingLayer = new google.maps.Data();
            this.restrict = 'A';
            this.link = function (scope, element, attrs) {
                var vm = _this;
                _this.$scope = scope;
                vm.initializeScope(scope, element[0]);
                vm.updateData(scope, false);
                vm.refreshMyLocation(scope.mapFunction.map);
                _this.infowindow = new google.maps.InfoWindow({ maxWidth: 400 });
                // Temporary code
                _this.parkingLotService.getByBounds(52, 10, 58, 13, function (data) {
                    data.forEach(function (point) {
                        if (!point.HouseNumber) {
                            vm.parkingLotService.UpdateParkingLotInfo(vm.$scope, new google.maps.LatLng(point.Latitude, point.Longitude), point, function (p) {
                                vm.parkingLotService.updateHouseNumber(p.Id, p.HouseNumber, function () { }, function () { alert('error'); });
                            });
                        }
                    });
                }, function () { });
                // Temporary code
                google.maps.event.addListener(scope.mapFunction.map, 'click', function (point) {
                    scope.mapFunction.selectedParkingLot = null;
                    vm.killInfoWIndow();
                    //var callback = function () {
                    //    scope.mapClick(scope, { point: point.latLng });
                    //};
                    //scope.$apply(callback);
                    if (scope.mapFunction.addingParkingLot) {
                        vm.addMarker(scope, point.latLng);
                    }
                    else {
                        vm.removeMarker();
                    }
                });
                google.maps.event.addListener(scope.mapFunction.map, 'idle', function () {
                    var bounds = scope.mapFunction.map.getBounds();
                    if (!scope.mapSeenBounds || !scope.mapSeenBounds.contains(bounds.getNorthEast()) || !scope.mapSeenBounds.contains(bounds.getSouthWest())) {
                        scope.isLoading = true;
                        scope.mapSeenBounds = bounds;
                        vm.updateData(scope, true);
                    }
                });
                scope.infoWindowButtonClick = function () {
                    if (scope.infowindowStep == 1) {
                        scope.infowindowStep = 2;
                    }
                    else {
                        vm.createParkingLot(scope.mapFunction.selectedParkingLot);
                    }
                };
                scope.$watch(function () { return scope.mapFunction.addingParkingLot; }, function (newValue, oldValue) {
                    if (oldValue != newValue && newValue === false) {
                        vm.removeMarker();
                    }
                });
                scope.$watch(function () { return scope.mapFunction.showLayer; }, function (newValue, oldValue) {
                    if (oldValue != newValue) {
                        vm.showHideLayer();
                    }
                });
                scope.$watch(function () { return scope.mapBounds; }, function (newValue, oldValue) {
                    if ((!oldValue && newValue) || (oldValue != newValue && newValue != null && newValue.getNorthEast().lat() != oldValue.getNorthEast().lat() && newValue.getNorthEast().lng() != oldValue.getNorthEast().lng()
                        && newValue.getSouthWest().lat() != oldValue.getSouthWest().lat() && newValue.getSouthWest().lng() != oldValue.getSouthWest().lng())) {
                        scope.mapFunction.map.fitBounds(newValue);
                    }
                });
            };
        }
        ParkingMapDirective.prototype.showHideLayer = function () {
            var vm = this;
            if (vm.$scope.mapFunction.showLayer) {
                vm.$scope.isLoading = true;
                this.parkingLotService.getLayerByBounds(this.$scope.mapSeenBounds.getSouthWest().lat(), this.$scope.mapSeenBounds.getSouthWest().lng(), this.$scope.mapSeenBounds.getNorthEast().lat(), this.$scope.mapSeenBounds.getNorthEast().lng(), function (data) {
                    vm.parkingLayer = new google.maps.Data();
                    vm.parkingLayer.addListener('addfeature', function () {
                        vm.$timeout(function () {
                            vm.$scope.isLoading = false;
                        });
                    });
                    vm.parkingLayer.addGeoJson(data);
                    vm.parkingLayer.setStyle(function (feature) {
                        return ({
                            strokeColor: "#999",
                            strokeWeight: feature.getProperty('stroke')
                        });
                    });
                    vm.parkingLayer.setMap(vm.$scope.mapFunction.map);
                }, function () {
                    vm.$scope.isLoading = false;
                });
            }
            else {
                vm.parkingLayer.setMap(null);
            }
        };
        ParkingMapDirective.prototype.addMarker = function (scope, point) {
            var newParkingLot = new Parking.ParkingLot();
            this.parkingLotService.UpdateParkingLotInfo(scope, point, newParkingLot, function () { });
            this.parkingLotService.getParkingZone(point.lat(), point.lng(), function (data) {
                newParkingLot.ParkingZone = data;
            }, function () { });
            newParkingLot.PlaceNumber = 0;
            newParkingLot.ParkingRegulation = Parking.ParkingRegulation.None;
            newParkingLot.ParkingStandard = Parking.ParkingStandard.None;
            newParkingLot.StreetDirection = Parking.StreetDirection.None;
            newParkingLot.Street.StreetOwnership = Parking.StreetOwnership.None;
            newParkingLot.Latitude = point.lat();
            newParkingLot.Longitude = point.lng();
            scope.mapFunction.selectedParkingLot = newParkingLot;
            scope.infowindowStep = 1;
            this.killInfoWIndow();
            if (!this.tinyMarker) {
                this.tinyMarker = new google.maps.Marker({
                    position: point,
                    map: scope.mapFunction.map /*,
                icon: tinyIcon*/
                });
            }
            else {
                this.tinyMarker.setPosition(point);
            }
            var content = '<div ng-include="\'/templates/infowindow/parkinglotCreate.html\'"></div>';
            var compiled = this.$compile(content)(scope);
            this.infowindow.setContent(compiled[0]);
            this.infowindow.open(scope.mapFunction.map, this.tinyMarker);
        };
        ParkingMapDirective.prototype.getMyLocation = function (map, success) {
            var currentLocation = {
                accuracy: 0,
                altitude: 0,
                altitudeAccuracy: 0,
                heading: 0,
                latitude: 55.676098,
                longitude: 12.568337,
                speed: 0
            };
            // Try HTML5 geolocation.
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    if (typeof success != "undefined") {
                        success(position.coords);
                    }
                }, function () {
                    if (typeof success != "undefined") {
                        success(currentLocation);
                    }
                });
            }
            else {
                if (typeof success != "undefined") {
                    success(currentLocation);
                }
            }
        };
        ParkingMapDirective.prototype.refreshMyLocation = function (map) {
            this.getMyLocation(map, function (myLocation) {
                var options = {
                    enableHighAccuracy: false,
                    timeout: 5000,
                    maximumAge: 0
                };
                map.setCenter(new google.maps.LatLng(myLocation.latitude, myLocation.longitude));
                map.setZoom(18);
                var arrowIcon = {
                    path: 'M 1,34 17,1 34,34 17,24 z',
                    strokeColor: '#00F',
                    fillColor: '#00F',
                    fillOpacity: 1,
                    rotation: myLocation.heading
                };
                var myLocationMarker = new google.maps.Marker({
                    position: new google.maps.LatLng(myLocation.latitude, myLocation.longitude),
                    map: map,
                    animation: google.maps.Animation.DROP,
                    icon: arrowIcon
                });
                /*navigator.geolocation.watchPosition((pos) => {
                    myLocationMarker.setPosition(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
                }, () => { }, options);*/
            });
        };
        ParkingMapDirective.prototype.updateData = function (scope, oneCall) {
            var vm = this;
            this.parkingLotService.getByBounds(scope.mapSeenBounds.getSouthWest().lat(), scope.mapSeenBounds.getSouthWest().lng(), scope.mapSeenBounds.getNorthEast().lat(), scope.mapSeenBounds.getNorthEast().lng(), function (data) {
                vm.drawMarkers(scope, data, vm);
                if (!oneCall) {
                }
            }, function () { });
        };
        ParkingMapDirective.prototype.drawMarkers = function (scope, data, vm) {
            if (scope.markers) {
                scope.markers.forEach(function (point) { point.setMap(null); });
            }
            scope.markers = [];
            if (scope.markerClusterer) {
                scope.markerClusterer.clearMarkers();
            }
            var currentMarker = null;
            data.forEach(function (parkingLot) {
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(parkingLot.Latitude, parkingLot.Longitude),
                    map: scope.mapFunction.map,
                    icon: vm.getIconUrl(parkingLot)
                });
                marker.parkingLot = parkingLot;
                var localScope = scope;
                google.maps.event.addListener(marker, 'click', function () {
                    vm.$timeout(function () {
                        scope.mapFunction.selectedParkingLot = marker.parkingLot;
                        scope.mapFunction.addingParkingLot = false;
                    });
                    vm.removeMarker();
                    vm.showInfoWindow(localScope, marker);
                });
                scope.markers.push(marker);
                if (scope.mapFunction.selectedParkingLot && scope.mapFunction.selectedParkingLot.Id == parkingLot.Id) {
                    currentMarker = marker;
                    scope.mapFunction.selectedParkingLot = parkingLot;
                }
            });
            scope.markerClusterer = new MarkerClusterer(scope.mapFunction.map, scope.markers, []);
            vm.$scope.isLoading = false;
            if (currentMarker) {
                vm.showInfoWindow(scope, currentMarker);
            }
        };
        ParkingMapDirective.prototype.showInfoWindow = function (localScope, marker) {
            this.killInfoWIndow();
            var content = '<div ng-include="\'/templates/infowindow/parkinglotView.html\'"></div>';
            var compiled = this.$compile(content)(localScope)[0];
            this.infowindow.setContent(compiled);
            this.infowindow.open(localScope.mapFunction.map, marker);
        };
        ParkingMapDirective.prototype.createParkingLot = function (parkingLot) {
            this.parkingLotService.createNew(parkingLot.Latitude, parkingLot.Longitude, parkingLot.Street.Name, parkingLot.HouseNumber, parkingLot.Street.ZipCode, parkingLot.Street.City, parkingLot.Street.District, parkingLot.StreetDirection, parkingLot.PlaceNumber, parkingLot.ParkingZone ? parkingLot.ParkingZone.Id : null, parkingLot.ParkingRegulation, parkingLot.ParkingStandard, parkingLot.Street.StreetOwnership, parkingLot.Notes, function (data) {
                alert("OK");
            }, function () {
                alert("ERROR");
            });
        };
        ParkingMapDirective.prototype.removeMarker = function () {
            if (this.tinyMarker) {
                this.killInfoWIndow();
                this.tinyMarker.setMap(null);
                this.tinyMarker = null;
            }
        };
        ParkingMapDirective.prototype.killInfoWIndow = function () {
            //if (this.infowindow.getContent()) {
            //    angular.element(this.infowindow.getContent()).parent().html('');
            //}
            this.infowindow.anchor = null;
            this.infowindow.setContent(null);
            this.infowindow.close();
            $('.gm-style-iw .ng-scope').parent().html('');
            this.infowindow = new google.maps.InfoWindow({ maxWidth: 400 });
        };
        ParkingMapDirective.prototype.initializeScope = function (scope, mapElement) {
            scope.streetDirections = Parking.EnumValueList.GetStreetDirections();
            scope.streetOwnerships = Parking.EnumValueList.GetStreetOwnerships();
            scope.parkingStandards = Parking.EnumValueList.GetParkingStandards();
            scope.parkingRegulations = Parking.EnumValueList.GetParkingRegulations();
            scope.mapCenter = new google.maps.LatLng(55.676098, 12.568337);
            var mapOptions = {
                center: new google.maps.LatLng(55.676098, 12.568337),
                zoom: 12,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var vm = this;
            var mapFunctions = new Parking.MapFunction();
            mapFunctions.panToParkingLot =
                function (id, parentScope) {
                    for (var i = 0; i < scope.markers.length - 1; i++) {
                        if (scope.markers[i].parkingLot.Id == id) {
                            scope.mapFunction.map.setZoom(20);
                            scope.mapFunction.map.panTo(scope.markers[i].getPosition());
                            vm.$timeout(function () {
                                parentScope.mapFunction.selectedParkingLot = scope.markers[i].parkingLot;
                                parentScope.mapFunction.addingParkingLot = false;
                                scope.mapFunction.selectedParkingLot = scope.markers[i].parkingLot;
                                scope.mapFunction.addingParkingLot = false;
                            });
                            vm.removeMarker();
                            vm.showInfoWindow(scope, scope.markers[i]);
                            break;
                        }
                    }
                };
            mapFunctions.map = new google.maps.Map(mapElement, mapOptions);
            mapFunctions.getMyLocation = this.getMyLocation;
            mapFunctions.addingParkingLot = false;
            scope.setFn(mapFunctions);
            scope.mapFunction = mapFunctions;
            scope.mapSeenBounds = new google.maps.LatLngBounds(new google.maps.LatLng(55.55750836696853, 11.898721654783458), new google.maps.LatLng(55.78982948753824, 13.205408056150645));
            scope.getStreetDirectionText = this.getStreetDirectionText;
            scope.getParkingRegulationText = this.getParkingRegulationText;
            scope.getParkingStandardText = this.getParkingStandardText;
            scope.getStreetOwnership = this.getStreetOwnershipText;
        };
        ParkingMapDirective.prototype.getStreetDirectionText = function (streetDirection) {
            return Parking.ConvertToString.StreetDirection(streetDirection);
        };
        ParkingMapDirective.prototype.getParkingRegulationText = function (parkingRegulation) {
            return Parking.ConvertToString.ParkingRegulation(parkingRegulation);
        };
        ParkingMapDirective.prototype.getParkingStandardText = function (parkingStandard) {
            return Parking.ConvertToString.ParkingStandard(parkingStandard);
        };
        ParkingMapDirective.prototype.getStreetOwnershipText = function (streetOwnership) {
            return Parking.ConvertToString.StreetOwnership(streetOwnership);
        };
        ParkingMapDirective.prototype.getIconUrl = function (parkingLot) {
            var icon_url = '/content/img/icon/';
            if (parkingLot.ParkingRegulation == Parking.ParkingRegulation.ElectricVehicle) {
                icon_url += 'electric';
            }
            else if (parkingLot.ParkingRegulation == Parking.ParkingRegulation.Handicape) {
                icon_url += 'disabled';
            }
            else if (parkingLot.ParkingRegulation == Parking.ParkingRegulation.Taxi) {
                icon_url += 'taxi';
            }
            else {
                icon_url += 'parking';
            }
            if (parkingLot.AvailablePlaces == 0) {
                icon_url += '_notavailable.png';
            }
            else if (parkingLot.AvailablePlaces > 0) {
                icon_url += '_available.png';
            }
            else {
                icon_url += '_unknown.png';
            }
            return icon_url;
        };
        ParkingMapDirective.factory = function () {
            var directive = function (parkingLotService, $parse, $compile, $q, $timeout) { return new ParkingMapDirective(parkingLotService, $parse, $compile, $q, $timeout); };
            directive.$inject = ['parkingLotService', '$parse', '$compile', '$q', '$timeout'];
            return directive;
        };
        return ParkingMapDirective;
    })();
    Parking.ParkingMapDirective = ParkingMapDirective;
})(Parking || (Parking = {}));
//# sourceMappingURL=ParkingMapDirective.js.map