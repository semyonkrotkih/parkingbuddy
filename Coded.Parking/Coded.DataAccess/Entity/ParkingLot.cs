using Coded.DataAccess.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Coded.DataAccess.Entity
{
    public class ParkingLot
    {
        public int Id { get; set; }
        public decimal Latitude { get; set; }
        public decimal Longitude { get; set; }
        public string WkbGeometry { get; set; }
        public int PlaceNumber { get; set; }
        public int AvailablePlaces { get; set; }
        public string Notes { get; set; }
        public string HouseNumber { get; set; }
        public ParkingZone ParkingZone { get; set; }
        public Street Street { get; set; }
        public ParkingRegulation ParkingRegulation { get; set; }
        public ParkingStandard ParkingStandard { get; set; }
        public StreetDirection StreetDirection { get; set; }
    }

    public class ParkingLotLight
    {
        public int Id { get; set; }
        public decimal Latitude { get; set; }
        public decimal Longitude { get; set; }
        public int PlaceNumber { get; set; }
        public string StreetName { get; set; }
        public string HouseNumber { get; set; }
        public string City { get; set; }
        public string ZipCode { get; set; }
        public string District { get; set; }
    }
}
