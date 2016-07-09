module Parking
{
    export class ParkingLotService
    {
        constructor(public $http: ng.IHttpService) { }
        public getByBounds(southWestLat: number, southWestLon: number, nordEastLat: number, nordEastLon: number, successCallback: angular.IHttpPromiseCallback<any>, errorCallback: angular.IHttpPromiseCallback<any>)
        {
            return this.$http.get('/api/Parking/ByBounds?southWestLat=' + southWestLat + '&southWestLon=' + southWestLon + '&nordEastLat=' + nordEastLat + '&nordEastLon=' + nordEastLon).success(successCallback).error(errorCallback);
        }

        public findParkingAround(lat: number, lon: number, successCallback: angular.IHttpPromiseCallback<any>, errorCallback: angular.IHttpPromiseCallback<any>) {
            return this.$http.get('/api/Parking/FindParkingAround?lat=' + lat + '&lon=' + lon).success(successCallback).error(errorCallback);
        }

        public getLayerByBounds(southWestLat: number, southWestLon: number, nordEastLat: number, nordEastLon: number, successCallback: angular.IHttpPromiseCallback<any>, errorCallback: angular.IHttpPromiseCallback<any>) {
            return this.$http.get('/api/Parking/LayerByBounds?southWestLat=' + southWestLat + '&southWestLon=' + southWestLon + '&nordEastLat=' + nordEastLat + '&nordEastLon=' + nordEastLon).success(successCallback).error(errorCallback);
        }

        public reportAvailability(parkingId: number, freePlaces: number, isApproximate: boolean, successCallback: angular.IHttpPromiseCallback<any>, errorCallback: angular.IHttpPromiseCallback<any>) {
            return this.$http.post('http://' + location.hostname + '/api/Parking/ReportAvailability?parkingId=' + parkingId + '&freePlaces=' + freePlaces + '&isApproximate=' + isApproximate, {}).success(successCallback).error(errorCallback);
        }

        public createNew(lat: number, lon: number, streetName: string, houseNumber: string, zipCode: string, city: string, district: string, streetDirectionId: number, totalSpaces: number, parkingZoneId: number, parkingRegulationsId: number, parkingStandardId: number, streetOwnership: number, notes: string,  successCallback: angular.IHttpPromiseCallback<any>, errorCallback: angular.IHttpPromiseCallback<any>) {
            return this.$http.post('http://' + location.hostname + '/api/Parking/CreateNew?lat=' + lat + '&lon=' + lon + '&streetName=' + streetName + '&houseNumber=' + houseNumber + '&zipCode=' + zipCode + '&city=' + city + '&district=' + district + '&streetDirectionId=' + streetDirectionId + '&totalSpaces=' + totalSpaces + '&parkingZoneId=' + parkingZoneId + '&parkingRegulationsId=' + parkingRegulationsId + '&parkingStandardId=' + parkingStandardId + '&streetOwnership=' + streetOwnership + '&notes=' + notes, {}).success(successCallback).error(errorCallback);
        }

        public getParkingZone(lat: number, lon: number, successCallback: angular.IHttpPromiseCallback<any>, errorCallback: angular.IHttpPromiseCallback<any>) {
            return this.$http.get('http://' + location.host + '/api/Parking/GetParkingZone?lat=' + lat + '&lon=' + lon).success(successCallback).error(errorCallback);
        }

        public getAllAddresses(successCallback: angular.IHttpPromiseCallback<any>, errorCallback: angular.IHttpPromiseCallback<any>) {
            return this.$http.get('http://' + location.host + '/api/Address/GetAll').success(successCallback).error(errorCallback);
        }

        public getBoundsByAddress(streetName: string, zipCode: string, district: string, city: string,successCallback: angular.IHttpPromiseCallback<any>, errorCallback: angular.IHttpPromiseCallback<any>) {
            return this.$http.get('http://' + location.host + '/api/Address/GetBounds?streetName=' + streetName + '&zipCode=' + zipCode + '&city=' + city + '&district=' + district).success(successCallback).error(errorCallback);
        }

        public authorize(login: string, password: string, successCallback: angular.IHttpPromiseCallback<any>, errorCallback: angular.IHttpPromiseCallback<any>) {
            return this.$http.post('http://' + location.host + '/api/Account/Logon?login=' + login + '&password=' + password, {}).success(successCallback).error(errorCallback);
        }

        public getUserInfo(successCallback: angular.IHttpPromiseCallback<any>, errorCallback: angular.IHttpPromiseCallback<any>) {
            return this.$http.get('http://' + location.host + '/api/Account/UserInfo', {}).success(successCallback).error(errorCallback);
        }

        public createAccount(login: string, password: string, firstName: string, lastName: string, email: string, successCallback: angular.IHttpPromiseCallback<any>, errorCallback: angular.IHttpPromiseCallback<any>) {
            return this.$http.post('http://' + location.host + '/api/Account/CreateAccount?login=' + login + '&password=' + password + '&firstName=' + firstName + '&lastName=' + lastName + '&email=' + email, {}).success(successCallback).error(errorCallback);
        }

        public updateHouseNumber(parkingId: number, houseNumber: string, successCallback: angular.IHttpPromiseCallback<any>, errorCallback: angular.IHttpPromiseCallback<any>) {
            return this.$http.post('http://' + location.host + '/api/Parking/UpdateHouseNumber?parkingId=' + parkingId + '&houseNumber=' + houseNumber, {}).success(successCallback).error(errorCallback);
        }

        // Global functions
        public UpdateParkingLotInfo(scope: IMainCtrlScope, point: google.maps.LatLng, parkingLot: ParkingLot, callback: Function) {
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
                    scope.$apply(function () { parkingLot });
                    if (callback)
                    {
                        callback(parkingLot);
                    }
                }
            });
        }
    }
} 