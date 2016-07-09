module Parking {
    export interface IParkingMapScope extends ng.IScope {
        mapCenter: google.maps.LatLng,
        mapZoom: number,
        markers: google.maps.Marker[],
        markerClusterer: MarkerClusterer,
        mapSeenBounds: google.maps.LatLngBounds,
        mapClick: Function,
        infowindowStep: number,
        selectedParkingLot: ParkingLot,
        infoWindowButtonClick: Function,
        streetDirections: KeyValuePair[],
        streetOwnerships: KeyValuePair[],
        parkingStandards: KeyValuePair[],
        parkingRegulations: KeyValuePair[],
        getStreetDirectionText: Function,
        getParkingRegulationText: Function,
        getParkingStandardText: Function,
        map: google.maps.Map,
        getMyLocation: Function,
        addingParkingLot: boolean,
        isLoading: boolean,
        showLayer: boolean,
        mapBounds: google.maps.LatLngBounds,
        //setFn: Function,
        getStreetOwnership: Function;
    }
    export class ParkingMapDirective implements ng.IDirective {
        public scope = false; //{ setFn: '&', mapClick: '&', addingParkingLot: '=', mapBounds: '=', map: '=', isLoading: '=', showLayer: '=', selectedParkingLot: '=', getMyLocation: '='};
        public $scope: IMainCtrlScope;
        public parkingLayer = new google.maps.Data();
        private tinyMarker: google.maps.Marker;
        private infowindow: google.maps.InfoWindow;
        restrict = 'A';
        constructor(public parkingLotService: Parking.ParkingLotService, public $parse: ng.IParseService, public $compile: ng.ICompileService, public $q: ng.IQService, public $timeout: ng.ITimeoutService) {
        }

        link = (scope: IMainCtrlScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {
            var vm = this;
            this.$scope = scope;
            vm.initializeScope(scope, element[0]);
            vm.updateData(scope, false);
            vm.refreshMyLocation(scope.mapFunction.map);
            this.infowindow = new google.maps.InfoWindow({ maxWidth: 400 });

            // Temporary code

            this.parkingLotService.getByBounds(52, 10, 58, 13,
                function (data: Parking.ParkingLot[]) {
                    data.forEach((point: ParkingLot) => {
                        if (!point.HouseNumber) {
                            vm.parkingLotService.UpdateParkingLotInfo(vm.$scope, new google.maps.LatLng(point.Latitude, point.Longitude), point, (p) => {
                                vm.parkingLotService.updateHouseNumber(p.Id, p.HouseNumber,
                                    () => { },
                                    () => { alert('error') });
                            });
                            
                        }
                    });
                },
                function ()
                { });

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
            }

            scope.$watch(() => scope.mapFunction.addingParkingLot, (newValue: boolean, oldValue: boolean) => {
                if (oldValue != newValue && newValue === false) {
                    vm.removeMarker();
                }
            });

            scope.$watch(() => scope.mapFunction.showLayer, (newValue: boolean, oldValue: boolean) => {
                if (oldValue != newValue) {
                    vm.showHideLayer();
                }
            });


            scope.$watch(() => scope.mapBounds, (newValue: google.maps.LatLngBounds, oldValue: google.maps.LatLngBounds) => {
                if ((!oldValue && newValue) || (oldValue != newValue && newValue != null && newValue.getNorthEast().lat() != oldValue.getNorthEast().lat() && newValue.getNorthEast().lng() != oldValue.getNorthEast().lng()
                    && newValue.getSouthWest().lat() != oldValue.getSouthWest().lat() && newValue.getSouthWest().lng() != oldValue.getSouthWest().lng())) {
                    scope.mapFunction.map.fitBounds(newValue);
                }
            });
        }

        public showHideLayer() {
            var vm = this;
            if (vm.$scope.mapFunction.showLayer) {
                vm.$scope.isLoading = true;
                this.parkingLotService.getLayerByBounds(this.$scope.mapSeenBounds.getSouthWest().lat(), this.$scope.mapSeenBounds.getSouthWest().lng(), this.$scope.mapSeenBounds.getNorthEast().lat(), this.$scope.mapSeenBounds.getNorthEast().lng(),
                    function (data: Object[]) {

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
                    },
                    function ()
                    {
                        vm.$scope.isLoading = false;
                    });
            }
            else {
                vm.parkingLayer.setMap(null);
            }
        }


        public addMarker(scope: IMainCtrlScope, point: google.maps.LatLng)
        {
            var newParkingLot = new ParkingLot();

            this.parkingLotService.UpdateParkingLotInfo(scope, point, newParkingLot, () => { });
            this.parkingLotService.getParkingZone(point.lat(), point.lng(), function (data: ParkingZone) {
                newParkingLot.ParkingZone = data;
            }, function () { });

            newParkingLot.PlaceNumber = 0;
            newParkingLot.ParkingRegulation = ParkingRegulation.None;
            newParkingLot.ParkingStandard = ParkingStandard.None;
            newParkingLot.StreetDirection = StreetDirection.None;
            newParkingLot.Street.StreetOwnership = StreetOwnership.None;
            newParkingLot.Latitude = point.lat();
            newParkingLot.Longitude = point.lng();
            scope.mapFunction.selectedParkingLot = newParkingLot;
            scope.infowindowStep = 1;
            this.killInfoWIndow();
            if (!this.tinyMarker) {
                this.tinyMarker = new google.maps.Marker({
                    position: point,
                    map: scope.mapFunction.map/*,
                icon: tinyIcon*/
                });
            }
            else
            {
                this.tinyMarker.setPosition(point);
            }
            var content = '<div ng-include="\'/templates/infowindow/parkinglotCreate.html\'"></div>';
            var compiled = this.$compile(content)(scope);
            this.infowindow.setContent(compiled[0]);
            this.infowindow.open(scope.mapFunction.map, this.tinyMarker);
        }

        public getMyLocation(map: google.maps.Map, success: Function)
        {
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
                navigator.geolocation.getCurrentPosition(function (position: Position) {
                    if (typeof success != "undefined") {
                        success(position.coords);
                    }
                }
                , function () {
                    if (typeof success != "undefined") {
                        success(currentLocation);
                    }
                });
            }
            else
            {
                if (typeof success != "undefined") {
                    success(currentLocation);
                }
            }
        }

        private refreshMyLocation(map: google.maps.Map)
        {
            this.getMyLocation(map, (myLocation: Coordinates) => {
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
        }

        private updateData(scope: IMainCtrlScope, oneCall: boolean)
        {
            var vm = this;
            this.parkingLotService.getByBounds(scope.mapSeenBounds.getSouthWest().lat(), scope.mapSeenBounds.getSouthWest().lng(), scope.mapSeenBounds.getNorthEast().lat(), scope.mapSeenBounds.getNorthEast().lng(),
                function (data: Parking.ParkingLot[]) {
                    vm.drawMarkers(scope, data, vm);
                    if (!oneCall) {
                        //vm.$timeout(function () { vm.updateData(scope, false); }, 60000);
                    }
                },
                function ()
                { });
        }

        private drawMarkers(scope: IMainCtrlScope, data: Parking.ParkingLot[], vm: Parking.ParkingMapDirective)
        {
            if (scope.markers) {
                scope.markers.forEach(function (point) { point.setMap(null); });
            }
            scope.markers = [];
            if (scope.markerClusterer) {
                scope.markerClusterer.clearMarkers();
            }
            var currentMarker = null;
            data.forEach(function (parkingLot: Parking.ParkingLot) {
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(parkingLot.Latitude, parkingLot.Longitude),
                    map: scope.mapFunction.map,
                    icon: vm.getIconUrl(parkingLot)
                });
                marker.parkingLot = parkingLot;
                var localScope = scope;
                google.maps.event.addListener(
                    marker,
                    'click',
                    function () {
                        vm.$timeout(function () {
                            scope.mapFunction.selectedParkingLot = marker.parkingLot;
                            scope.mapFunction.addingParkingLot = false;
                        });
                        vm.removeMarker();
                        vm.showInfoWindow(localScope, marker);
                    });
                scope.markers.push(marker);
                if (scope.mapFunction.selectedParkingLot && scope.mapFunction.selectedParkingLot.Id == parkingLot.Id)
                {
                    currentMarker = marker;
                    scope.mapFunction.selectedParkingLot = parkingLot;
                }
            });
            scope.markerClusterer = new MarkerClusterer(scope.mapFunction.map, scope.markers, []);
            vm.$scope.isLoading = false;
            if (currentMarker)
            {
                vm.showInfoWindow(scope, currentMarker);
            }
        }

        private showInfoWindow(localScope: IMainCtrlScope, marker: google.maps.Marker) {
            this.killInfoWIndow();
            var content = '<div ng-include="\'/templates/infowindow/parkinglotView.html\'"></div>';
            var compiled = this.$compile(content)(localScope)[0];
            this.infowindow.setContent(compiled);
            this.infowindow.open(localScope.mapFunction.map, marker);
        }

        public createParkingLot(parkingLot: ParkingLot) {
            this.parkingLotService.createNew(parkingLot.Latitude, parkingLot.Longitude, parkingLot.Street.Name, parkingLot.HouseNumber, parkingLot.Street.ZipCode, parkingLot.Street.City, parkingLot.Street.District, parkingLot.StreetDirection, parkingLot.PlaceNumber, parkingLot.ParkingZone ? parkingLot.ParkingZone.Id : null, parkingLot.ParkingRegulation, parkingLot.ParkingStandard, parkingLot.Street.StreetOwnership, parkingLot.Notes, function (data) {
                alert("OK");
            },
            function () {
                alert("ERROR");
            });
        }

        public removeMarker() {
            if (this.tinyMarker) {
                this.killInfoWIndow();
                this.tinyMarker.setMap(null);
                this.tinyMarker = null;
                
            }
        }

        public killInfoWIndow()
        {
            //if (this.infowindow.getContent()) {
            //    angular.element(this.infowindow.getContent()).parent().html('');
            //}
            (<any>this.infowindow).anchor = null;
            this.infowindow.setContent(null);
            this.infowindow.close();
            $('.gm-style-iw .ng-scope').parent().html('');
            this.infowindow = new google.maps.InfoWindow({ maxWidth: 400 });
        }

        public initializeScope(scope: IMainCtrlScope, mapElement: Element) {
            scope.streetDirections = Parking.EnumValueList.GetStreetDirections();
            scope.streetOwnerships = Parking.EnumValueList.GetStreetOwnerships();
            scope.parkingStandards = Parking.EnumValueList.GetParkingStandards();
            scope.parkingRegulations = Parking.EnumValueList.GetParkingRegulations();
            scope.mapCenter = new google.maps.LatLng(55.676098, 12.568337);
            var mapOptions = {
                center: new google.maps.LatLng(55.676098, 12.568337),
                zoom: 12,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            }
            var vm = this;
            var mapFunctions = new MapFunction();
            mapFunctions.panToParkingLot =
            (id: number, parentScope: IMainCtrlScope) => {
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
            }
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
            
        }

        public getStreetDirectionText(streetDirection: StreetDirection) {
            return ConvertToString.StreetDirection(streetDirection);
        }

        public getParkingRegulationText(parkingRegulation: ParkingRegulation) {
            return ConvertToString.ParkingRegulation(parkingRegulation);
        }

        public getParkingStandardText(parkingStandard: ParkingStandard) {
            return ConvertToString.ParkingStandard(parkingStandard);
        }

        public getStreetOwnershipText(streetOwnership: StreetOwnership) {
            return ConvertToString.StreetOwnership(streetOwnership);
        }

        private getIconUrl(parkingLot: Parking.ParkingLot): string
        {
            var icon_url = '/content/img/icon/';
            if (parkingLot.ParkingRegulation == ParkingRegulation.ElectricVehicle) {
                icon_url += 'electric';
            }
            else if (parkingLot.ParkingRegulation == ParkingRegulation.Handicape) {
                icon_url += 'disabled';
            }
            else if (parkingLot.ParkingRegulation == ParkingRegulation.Taxi) {
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
            else
            {
                icon_url += '_unknown.png';
            }
            return icon_url;
        }
         
        static factory(): ng.IDirectiveFactory {
            const directive = (parkingLotService: Parking.ParkingLotService, $parse: ng.IParseService, $compile: ng.ICompileService, $q: ng.IQService, $timeout: ng.ITimeoutService) => new ParkingMapDirective(parkingLotService, $parse, $compile, $q, $timeout);
            directive.$inject = ['parkingLotService', '$parse', '$compile', '$q', '$timeout'];
            return directive;
        }
    }
}