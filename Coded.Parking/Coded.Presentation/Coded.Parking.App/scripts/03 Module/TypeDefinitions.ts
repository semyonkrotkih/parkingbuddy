module Parking
{
    // ------------------------------ Interfaces -----------------------------------------------//
    export interface SignupCtrlScope extends ng.IScope {
        firstName: string;
        lastName: string;
        login: string;
        password: string;
        repeatPassword: string;
        email: string;
    }

    export interface IMainCtrlScope extends ng.IScope {
        currentUser: Account;
        showTopmenuDropdown: boolean;
        showSearch: boolean;
        showNavigation: boolean;
        globalVariables: GlobalVariables;
        prevent: Function;
        infowindow: google.maps.InfoWindow;
        mapBounds: google.maps.LatLngBounds;
        addresses: Address[];
        directionsDisplay: google.maps.DirectionsRenderer;
        directionsService: google.maps.DirectionsService;
        hasRight: boolean;
        isLoading: boolean;
        mapFunction: MapFunction;
        parkingLotFound: string;
        directions: MapDirections;
        suggestedParkingShowReceipt: boolean;
        selectedRouteIndex: number;


        mapCenter: google.maps.LatLng;
        mapZoom: number;
        markers: google.maps.Marker[];
        markerClusterer: MarkerClusterer;
        mapSeenBounds: google.maps.LatLngBounds;
        infowindowStep: number;
        infoWindowButtonClick: Function;
        streetDirections: KeyValuePair[];
        streetOwnerships: KeyValuePair[];
        parkingStandards: KeyValuePair[];
        parkingRegulations: KeyValuePair[];
        getStreetDirectionText: Function;
        getParkingRegulationText: Function;
        getParkingStandardText: Function;
        getStreetOwnership: Function;
        setFn: Function;
    }

    export class MapDirections {
        routePolylines: google.maps.Polyline[];
        directionRoutes: google.maps.DirectionsRoute[];
    }

    export interface LoginCtrlScope extends ng.IScope {
        userName: string;
        password: string;
        loginFail: boolean;
    }

    export class MapFunction {
        panToParkingLot: Function;
        getMyLocation: Function;
        mapClick: Function;
        showLayer: boolean;
        editMode: EditMode;
        map: google.maps.Map;
        addingParkingLot: boolean;
        selectedParkingLot: ParkingLot;
    }

    // -------------------------------- Enums -----------------------------------------------//

    export enum EditMode {
        None = 0,
        ReportAvailability = 1,
        FindParkingNearMe = 2,
        SelectRoute = 3
    }

    export enum StreetOwnership
    {
        InternalTrafficArea = 1,
        MunicipalRoad = 2,
        PrivateRoad = 3,
        PrivateRoadP2 = 4,
        None = 5
    }

    export enum StreetDirection {
        EvenHouseNumbers = 1,
        OddHouseNumbers = 2,
        MiddleOfTheRoad = 3,
        ParkingArea = 4,
        None = 5
    }

    export enum ParkingStandard {
        MarkedLot = 1,
        DiagonalLot30Degrees = 2,
        DiagonalLot45Degrees = 3,
        DiagonalLot60Degrees = 4,
        DiagonalLot75Degrees = 5,
        DiagonalLot90Degrees = 6,
        NotMarkedLot = 7,
        None = 8
    }

    export enum ParkingRegulation {
        Embessy = 1,
        Visitors = 2,
        SharedVehicle = 3,
        ElectricVehicle = 4,
        Handicape = 5,
        Motocycle = 6,
        PrivateRegulation = 7,
        Taxi = 8,
        TuoristBus = 9,
        Regular = 10,
        None = 11
    }

    export class ConvertToString
    {
        public static StreetOwnership(value: StreetOwnership): string
        {
            switch (value)
            {
                case StreetOwnership.InternalTrafficArea:
                    return "Internal traffic area";
                case StreetOwnership.MunicipalRoad:
                    return "Municipal road";
                case StreetOwnership.PrivateRoad:
                    return "Private road";
                case StreetOwnership.PrivateRoadP2:
                    return "Private road §2 pt. 1";
            }
            return "Unknown";
        }

        public static StreetDirection(value: StreetDirection): string {
            switch (value) {
                case StreetDirection.EvenHouseNumbers:
                    return "Even house numbers";
                case StreetDirection.OddHouseNumbers:
                    return "Odd house numbers";
                case StreetDirection.MiddleOfTheRoad:
                    return "Middle of the roadway";
                case StreetDirection.ParkingArea:
                    return "Parking area";
            }
            return "Unknown";
        }

        public static ParkingStandard(value: ParkingStandard): string {
            switch (value) {
                case ParkingStandard.MarkedLot:
                    return "Marked space";
                case ParkingStandard.DiagonalLot30Degrees:
                    return "Parallel parking 30&deg;";
                case ParkingStandard.DiagonalLot45Degrees:
                    return "Parallel parking 45&deg;"
                case ParkingStandard.DiagonalLot60Degrees:
                    return "Parallel parking 60&deg;"
                case ParkingStandard.DiagonalLot75Degrees:
                    return "Parallel parking 75&deg;"
                case ParkingStandard.DiagonalLot90Degrees:
                    return "Parallel parking 90&deg;"
                case ParkingStandard.NotMarkedLot:
                    return "Not marked space"
            }
            return "Unknown";
        }

        public static ParkingRegulation(value: ParkingRegulation): string {
            switch (value) {
                case ParkingRegulation.ElectricVehicle:
                    return "Only electrical vehicles";
                case ParkingRegulation.Embessy:
                    return "Only for embessy guests";
                case ParkingRegulation.Handicape:
                    return "Handicapped only";
                case ParkingRegulation.Motocycle:
                    return "Motocycles only";
                case ParkingRegulation.PrivateRegulation:
                    return "Private regulation (add a note)";
                case ParkingRegulation.Regular:
                    return "Any vehicles";
                case ParkingRegulation.SharedVehicle:
                    return "Shared vehicles only";
                case ParkingRegulation.Taxi:
                    return "Taxi parking space";
                case ParkingRegulation.TuoristBus:
                    return "Reserved for toursit bus";
                case ParkingRegulation.Visitors:
                    return "Reserved for visitors";
            }
            return "Unknown";
        }
    }

    export class EnumValueList {
        public static GetStreetOwnerships(): KeyValuePair[]
        {
            var result = [];
            result.push(new KeyValuePair(5, "Not selected"))
            var id = 1;
            while (ConvertToString.StreetOwnership(id) != "Unknown")
            {
                result.push(new KeyValuePair(id, ConvertToString.StreetOwnership(id)));
                id++;
            }
            return result;
        }
        public static GetStreetDirections(): KeyValuePair[] {
            var result = [];
            result.push(new KeyValuePair(5, "Not selected"))
            var id = 1;
            while (ConvertToString.StreetDirection(id) != "Unknown") {
                result.push(new KeyValuePair(id, ConvertToString.StreetDirection(id)));
                id++;
            }
            return result;
        }
        public static GetParkingStandards(): KeyValuePair[] {
            var result = [];
            result.push(new KeyValuePair(8, "Not selected"))
            var id = 1;
            while (ConvertToString.ParkingStandard(id) != "Unknown") {
                result.push(new KeyValuePair(id, ConvertToString.ParkingStandard(id)));
                id++;
            }
            return result;
        }
        public static GetParkingRegulations(): KeyValuePair[] {
            var result = [];
            result.push(new KeyValuePair(11, "Not selected"))
            var id = 1;
            while (ConvertToString.ParkingRegulation(id) != "Unknown") {
                result.push(new KeyValuePair(id, ConvertToString.ParkingRegulation(id)));
                id++;
            }
            return result;
        }
    }

    // -------------------------------- Classes -----------------------------------------------//

    export class GlobalVariables {
        public availabilityReportParking: ParkingLot;
        public suggestedLots: ParkingLot[];
        public selectedParkingLot: ParkingLot;
    }

    export class ParkingLot {
        public Id: number;
        public Street: Street;
        public HouseNumber: string;
        public PlaceNumber: number;
        public AvailablePlaces: number;
        public StreetDirection: StreetDirection;
        public ParkingZone: ParkingZone;
        public ParkingStandard: ParkingStandard;
        public ParkingRegulation: ParkingRegulation;
        public Latitude: number;
        public Longitude: number;
        public Notes: string;
        public IsReportApproximate: boolean;
        constructor()
        {
            this.Street = new Street();
        }
    }

    export class ParkingLotLight {
        public Id: number;
        public Latitude: number;
        public Longitude: number;
        public PlaceNumber: number;
        public StreetName: string;
        public HouseNumber: string;
        public City: string;
        public ZipCode: string;
        public District: string;
        public ToString(): string
        {
            return this.StreetName + (this.HouseNumber ? ', ' + this.HouseNumber : '') + (this.ZipCode ? ', ' + this.ZipCode : '') + (this.District ? ', ' + this.District : '') + (this.City ? ', ' + this.City : '');
        }
    }

    export class Address {
        public StreetName: string;
        public ZipCode: string;
        public City: string;
        public District: string;
        public ParkingCount: number;
        public static ToString(addr: Address): string {
            return addr.StreetName + (addr.ZipCode ? ', ' + addr.ZipCode : '') + (addr.District ? ', ' + addr.District : '') + (addr.City ? ', ' + addr.City : '');
        }
    }

    export class Street {
        public Id: number;
        public Name: string;
        public Code: string;
        public ZipCode: string;
        public City: string;
        public District: string;
        public StreetOwnership: StreetOwnership;
    }

    export class Account {
        public Login: string;
        public Password: string;
        public FirstName: string;
        public LastName: string;
        public Email: string;
    }

    export class ParkingZone {
        constructor(public Id: number, public Name: string, public Description: string, public Price: number) { }
    }

    export class KeyValuePair {
        constructor(public id: number, public name: string) { }
    }

    // -------------------------------- View model ---------------------------------------------//

    export class SignupViewModel {
        public Login: string;
        public Password: string;
        public RepeatPassword: string;
        public FirstName: string;
        public LastName: string;
        public Email: string;
    }
} 