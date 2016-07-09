var Parking;
(function (Parking) {
    var ParkingLotService = (function () {
        function ParkingLotService($http) {
            this.$http = $http;
        }
        ParkingLotService.prototype.getByBounds = function (southWestLat, southWestLon, nordEastLat, nordEastLon, successCallback, errorCallback) {
            return this.$http.get('/api/Parking/ByBounds?southWestLat=' + southWestLat + '&southWestLon=' + southWestLon + '&nordEastLat=' + nordEastLat + '&nordEastLon=' + nordEastLon).success(successCallback).error(errorCallback);
        };
        ParkingLotService.prototype.findParkingAround = function (lat, lon, successCallback, errorCallback) {
            return this.$http.get('/api/Parking/FindParkingAround?lat=' + lat + '&lon=' + lon).success(successCallback).error(errorCallback);
        };
        ParkingLotService.prototype.getLayerByBounds = function (southWestLat, southWestLon, nordEastLat, nordEastLon, successCallback, errorCallback) {
            return this.$http.get('/api/Parking/LayerByBounds?southWestLat=' + southWestLat + '&southWestLon=' + southWestLon + '&nordEastLat=' + nordEastLat + '&nordEastLon=' + nordEastLon).success(successCallback).error(errorCallback);
        };
        ParkingLotService.prototype.reportAvailability = function (parkingId, freePlaces, isApproximate, successCallback, errorCallback) {
            return this.$http.post('http://' + location.hostname + '/api/Parking/ReportAvailability?parkingId=' + parkingId + '&freePlaces=' + freePlaces + '&isApproximate=' + isApproximate, {}).success(successCallback).error(errorCallback);
        };
        ParkingLotService.prototype.createNew = function (lat, lon, streetName, houseNumber, zipCode, city, district, streetDirectionId, totalSpaces, parkingZoneId, parkingRegulationsId, parkingStandardId, streetOwnership, notes, successCallback, errorCallback) {
            return this.$http.post('http://' + location.hostname + '/api/Parking/CreateNew?lat=' + lat + '&lon=' + lon + '&streetName=' + streetName + '&houseNumber=' + houseNumber + '&zipCode=' + zipCode + '&city=' + city + '&district=' + district + '&streetDirectionId=' + streetDirectionId + '&totalSpaces=' + totalSpaces + '&parkingZoneId=' + parkingZoneId + '&parkingRegulationsId=' + parkingRegulationsId + '&parkingStandardId=' + parkingStandardId + '&streetOwnership=' + streetOwnership + '&notes=' + notes, {}).success(successCallback).error(errorCallback);
        };
        ParkingLotService.prototype.getParkingZone = function (lat, lon, successCallback, errorCallback) {
            return this.$http.get('http://' + location.host + '/api/Parking/GetParkingZone?lat=' + lat + '&lon=' + lon).success(successCallback).error(errorCallback);
        };
        ParkingLotService.prototype.getAllAddresses = function (successCallback, errorCallback) {
            return this.$http.get('http://' + location.host + '/api/Address/GetAll').success(successCallback).error(errorCallback);
        };
        ParkingLotService.prototype.getBoundsByAddress = function (streetName, zipCode, district, city, successCallback, errorCallback) {
            return this.$http.get('http://' + location.host + '/api/Address/GetBounds?streetName=' + streetName + '&zipCode=' + zipCode + '&city=' + city + '&district=' + district).success(successCallback).error(errorCallback);
        };
        ParkingLotService.prototype.authorize = function (login, password, successCallback, errorCallback) {
            return this.$http.post('http://' + location.host + '/api/Account/Logon?login=' + login + '&password=' + password, {}).success(successCallback).error(errorCallback);
        };
        ParkingLotService.prototype.getUserInfo = function (successCallback, errorCallback) {
            return this.$http.get('http://' + location.host + '/api/Account/UserInfo', {}).success(successCallback).error(errorCallback);
        };
        ParkingLotService.prototype.createAccount = function (login, password, firstName, lastName, email, successCallback, errorCallback) {
            return this.$http.post('http://' + location.host + '/api/Account/CreateAccount?login=' + login + '&password=' + password + '&firstName=' + firstName + '&lastName=' + lastName + '&email=' + email, {}).success(successCallback).error(errorCallback);
        };
        ParkingLotService.prototype.updateHouseNumber = function (parkingId, houseNumber, successCallback, errorCallback) {
            return this.$http.post('http://' + location.host + '/api/Parking/UpdateHouseNumber?parkingId=' + parkingId + '&houseNumber=' + houseNumber, {}).success(successCallback).error(errorCallback);
        };
        // Global functions
        ParkingLotService.prototype.UpdateParkingLotInfo = function (scope, point, parkingLot, callback) {
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({ 'latLng': point }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    for (var i = 0; i < results[0].address_components.length; i++) {
                        for (var j = 0; j < results[0].address_components[i].types.length; j++) {
                            if (results[0].address_components[i].types[j] == "postal_code") {
                                parkingLot.Street.ZipCode = results[0].address_components[i].long_name;
                                break;
                            }
                            if (results[0].address_components[i].types[j] == "street_number") {
                                parkingLot.HouseNumber = results[0].address_components[i].long_name;
                                break;
                            }
                            if (results[0].address_components[i].types[j] == "route") {
                                parkingLot.Street.Name = results[0].address_components[i].long_name;
                                break;
                            }
                            if (results[0].address_components[i].types[j] == "locality") {
                                parkingLot.Street.City = results[0].address_components[i].long_name;
                                break;
                            }
                            if (results[0].address_components[i].types[j] == "sublocality") {
                                parkingLot.Street.District = results[0].address_components[i].long_name;
                                break;
                            }
                        }
                    }
                    scope.$apply(function () { parkingLot; });
                    if (callback) {
                        callback(parkingLot);
                    }
                }
            });
        };
        return ParkingLotService;
    })();
    Parking.ParkingLotService = ParkingLotService;
})(Parking || (Parking = {}));
//# sourceMappingURL=ParkingLotService.js.map