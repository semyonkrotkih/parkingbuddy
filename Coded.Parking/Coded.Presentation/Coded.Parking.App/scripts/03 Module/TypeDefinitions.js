var Parking;
(function (Parking) {
    var MapDirections = (function () {
        function MapDirections() {
        }
        return MapDirections;
    })();
    Parking.MapDirections = MapDirections;
    var MapFunction = (function () {
        function MapFunction() {
        }
        return MapFunction;
    })();
    Parking.MapFunction = MapFunction;
    // -------------------------------- Enums -----------------------------------------------//
    (function (EditMode) {
        EditMode[EditMode["None"] = 0] = "None";
        EditMode[EditMode["ReportAvailability"] = 1] = "ReportAvailability";
        EditMode[EditMode["FindParkingNearMe"] = 2] = "FindParkingNearMe";
        EditMode[EditMode["SelectRoute"] = 3] = "SelectRoute";
    })(Parking.EditMode || (Parking.EditMode = {}));
    var EditMode = Parking.EditMode;
    (function (StreetOwnership) {
        StreetOwnership[StreetOwnership["InternalTrafficArea"] = 1] = "InternalTrafficArea";
        StreetOwnership[StreetOwnership["MunicipalRoad"] = 2] = "MunicipalRoad";
        StreetOwnership[StreetOwnership["PrivateRoad"] = 3] = "PrivateRoad";
        StreetOwnership[StreetOwnership["PrivateRoadP2"] = 4] = "PrivateRoadP2";
        StreetOwnership[StreetOwnership["None"] = 5] = "None";
    })(Parking.StreetOwnership || (Parking.StreetOwnership = {}));
    var StreetOwnership = Parking.StreetOwnership;
    (function (StreetDirection) {
        StreetDirection[StreetDirection["EvenHouseNumbers"] = 1] = "EvenHouseNumbers";
        StreetDirection[StreetDirection["OddHouseNumbers"] = 2] = "OddHouseNumbers";
        StreetDirection[StreetDirection["MiddleOfTheRoad"] = 3] = "MiddleOfTheRoad";
        StreetDirection[StreetDirection["ParkingArea"] = 4] = "ParkingArea";
        StreetDirection[StreetDirection["None"] = 5] = "None";
    })(Parking.StreetDirection || (Parking.StreetDirection = {}));
    var StreetDirection = Parking.StreetDirection;
    (function (ParkingStandard) {
        ParkingStandard[ParkingStandard["MarkedLot"] = 1] = "MarkedLot";
        ParkingStandard[ParkingStandard["DiagonalLot30Degrees"] = 2] = "DiagonalLot30Degrees";
        ParkingStandard[ParkingStandard["DiagonalLot45Degrees"] = 3] = "DiagonalLot45Degrees";
        ParkingStandard[ParkingStandard["DiagonalLot60Degrees"] = 4] = "DiagonalLot60Degrees";
        ParkingStandard[ParkingStandard["DiagonalLot75Degrees"] = 5] = "DiagonalLot75Degrees";
        ParkingStandard[ParkingStandard["DiagonalLot90Degrees"] = 6] = "DiagonalLot90Degrees";
        ParkingStandard[ParkingStandard["NotMarkedLot"] = 7] = "NotMarkedLot";
        ParkingStandard[ParkingStandard["None"] = 8] = "None";
    })(Parking.ParkingStandard || (Parking.ParkingStandard = {}));
    var ParkingStandard = Parking.ParkingStandard;
    (function (ParkingRegulation) {
        ParkingRegulation[ParkingRegulation["Embessy"] = 1] = "Embessy";
        ParkingRegulation[ParkingRegulation["Visitors"] = 2] = "Visitors";
        ParkingRegulation[ParkingRegulation["SharedVehicle"] = 3] = "SharedVehicle";
        ParkingRegulation[ParkingRegulation["ElectricVehicle"] = 4] = "ElectricVehicle";
        ParkingRegulation[ParkingRegulation["Handicape"] = 5] = "Handicape";
        ParkingRegulation[ParkingRegulation["Motocycle"] = 6] = "Motocycle";
        ParkingRegulation[ParkingRegulation["PrivateRegulation"] = 7] = "PrivateRegulation";
        ParkingRegulation[ParkingRegulation["Taxi"] = 8] = "Taxi";
        ParkingRegulation[ParkingRegulation["TuoristBus"] = 9] = "TuoristBus";
        ParkingRegulation[ParkingRegulation["Regular"] = 10] = "Regular";
        ParkingRegulation[ParkingRegulation["None"] = 11] = "None";
    })(Parking.ParkingRegulation || (Parking.ParkingRegulation = {}));
    var ParkingRegulation = Parking.ParkingRegulation;
    var ConvertToString = (function () {
        function ConvertToString() {
        }
        ConvertToString.StreetOwnership = function (value) {
            switch (value) {
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
        };
        ConvertToString.StreetDirection = function (value) {
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
        };
        ConvertToString.ParkingStandard = function (value) {
            switch (value) {
                case ParkingStandard.MarkedLot:
                    return "Marked space";
                case ParkingStandard.DiagonalLot30Degrees:
                    return "Parallel parking 30&deg;";
                case ParkingStandard.DiagonalLot45Degrees:
                    return "Parallel parking 45&deg;";
                case ParkingStandard.DiagonalLot60Degrees:
                    return "Parallel parking 60&deg;";
                case ParkingStandard.DiagonalLot75Degrees:
                    return "Parallel parking 75&deg;";
                case ParkingStandard.DiagonalLot90Degrees:
                    return "Parallel parking 90&deg;";
                case ParkingStandard.NotMarkedLot:
                    return "Not marked space";
            }
            return "Unknown";
        };
        ConvertToString.ParkingRegulation = function (value) {
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
        };
        return ConvertToString;
    })();
    Parking.ConvertToString = ConvertToString;
    var EnumValueList = (function () {
        function EnumValueList() {
        }
        EnumValueList.GetStreetOwnerships = function () {
            var result = [];
            result.push(new KeyValuePair(5, "Not selected"));
            var id = 1;
            while (ConvertToString.StreetOwnership(id) != "Unknown") {
                result.push(new KeyValuePair(id, ConvertToString.StreetOwnership(id)));
                id++;
            }
            return result;
        };
        EnumValueList.GetStreetDirections = function () {
            var result = [];
            result.push(new KeyValuePair(5, "Not selected"));
            var id = 1;
            while (ConvertToString.StreetDirection(id) != "Unknown") {
                result.push(new KeyValuePair(id, ConvertToString.StreetDirection(id)));
                id++;
            }
            return result;
        };
        EnumValueList.GetParkingStandards = function () {
            var result = [];
            result.push(new KeyValuePair(8, "Not selected"));
            var id = 1;
            while (ConvertToString.ParkingStandard(id) != "Unknown") {
                result.push(new KeyValuePair(id, ConvertToString.ParkingStandard(id)));
                id++;
            }
            return result;
        };
        EnumValueList.GetParkingRegulations = function () {
            var result = [];
            result.push(new KeyValuePair(11, "Not selected"));
            var id = 1;
            while (ConvertToString.ParkingRegulation(id) != "Unknown") {
                result.push(new KeyValuePair(id, ConvertToString.ParkingRegulation(id)));
                id++;
            }
            return result;
        };
        return EnumValueList;
    })();
    Parking.EnumValueList = EnumValueList;
    // -------------------------------- Classes -----------------------------------------------//
    var GlobalVariables = (function () {
        function GlobalVariables() {
        }
        return GlobalVariables;
    })();
    Parking.GlobalVariables = GlobalVariables;
    var ParkingLot = (function () {
        function ParkingLot() {
            this.Street = new Street();
        }
        return ParkingLot;
    })();
    Parking.ParkingLot = ParkingLot;
    var ParkingLotLight = (function () {
        function ParkingLotLight() {
        }
        ParkingLotLight.prototype.ToString = function () {
            return this.StreetName + (this.HouseNumber ? ', ' + this.HouseNumber : '') + (this.ZipCode ? ', ' + this.ZipCode : '') + (this.District ? ', ' + this.District : '') + (this.City ? ', ' + this.City : '');
        };
        return ParkingLotLight;
    })();
    Parking.ParkingLotLight = ParkingLotLight;
    var Address = (function () {
        function Address() {
        }
        Address.ToString = function (addr) {
            return addr.StreetName + (addr.ZipCode ? ', ' + addr.ZipCode : '') + (addr.District ? ', ' + addr.District : '') + (addr.City ? ', ' + addr.City : '');
        };
        return Address;
    })();
    Parking.Address = Address;
    var Street = (function () {
        function Street() {
        }
        return Street;
    })();
    Parking.Street = Street;
    var Account = (function () {
        function Account() {
        }
        return Account;
    })();
    Parking.Account = Account;
    var ParkingZone = (function () {
        function ParkingZone(Id, Name, Description, Price) {
            this.Id = Id;
            this.Name = Name;
            this.Description = Description;
            this.Price = Price;
        }
        return ParkingZone;
    })();
    Parking.ParkingZone = ParkingZone;
    var KeyValuePair = (function () {
        function KeyValuePair(id, name) {
            this.id = id;
            this.name = name;
        }
        return KeyValuePair;
    })();
    Parking.KeyValuePair = KeyValuePair;
    // -------------------------------- View model ---------------------------------------------//
    var SignupViewModel = (function () {
        function SignupViewModel() {
        }
        return SignupViewModel;
    })();
    Parking.SignupViewModel = SignupViewModel;
})(Parking || (Parking = {}));
//# sourceMappingURL=TypeDefinitions.js.map