using Coded.DataAccess.Entity;
using Coded.DataAccess.Provider;
using Coded.Presentation.Filters.Authorization;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace Coded.Presentation.Controllers
{
    [RoutePrefix("api/Parking")]
    public class ParkingController : ApiController
    {
        [Route("ByBounds")]
        public IHttpActionResult GetParkingLotsByBounds(string southWestLat, string southWestLon, string nordEastLat, string nordEastLon)
        {
            var usCulture = CultureInfo.GetCultureInfo("en-US");
            var southWest = new LatLong(decimal.Parse(southWestLat, usCulture), decimal.Parse(southWestLon, usCulture));
            var nordEast = new LatLong(decimal.Parse(nordEastLat, usCulture), decimal.Parse(nordEastLon, usCulture));
            var provider = new ParkingLotProvider();
            var parkingLots = provider.GetByBounds(southWest, nordEast);
            return Json(parkingLots);
        }

        [Route("FindParkingAround")]
        [HttpGet]
        public IHttpActionResult FindParkingAround(string lat, string lon)
        {
            var usCulture = CultureInfo.GetCultureInfo("en-US");
            var center = new LatLong(decimal.Parse(lat, usCulture), decimal.Parse(lon, usCulture));
            var provider = new ParkingLotProvider();
            var parkingLots = provider.FindParkingAround(center, 5);
            return Json(parkingLots);
        }

        [Route("LayerByBounds")]
        public IHttpActionResult GetLayerByBounds(string southWestLat, string southWestLon, string nordEastLat, string nordEastLon)
        {
            var usCulture = CultureInfo.GetCultureInfo("en-US");
            var southWest = new LatLong(decimal.Parse(southWestLat, usCulture), decimal.Parse(southWestLon, usCulture));
            var nordEast = new LatLong(decimal.Parse(nordEastLat, usCulture), decimal.Parse(nordEastLon, usCulture));
            var provider = new ParkingLotProvider();
            var parkingLots = provider.GetLayerByBounds(southWest, nordEast);
            return Json(parkingLots);
        }

        [Route("GetParkingZone")]
        public IHttpActionResult GetParkingZone(string lat, string lon)
        {
            var usCulture = CultureInfo.GetCultureInfo("en-US");
            var point = new LatLong(decimal.Parse(lat, usCulture), decimal.Parse(lon, usCulture));

            var provider = new ParkingLotProvider();
            var parkingLots = provider.GetParkingZone(point);
            return Json(parkingLots);
        }

        [Route("CreateNew")]
        [HttpPost]
        //[AuthorizeAccess]
        public IHttpActionResult CreateNewParking(string lat, string lon, string streetName, string houseNumber, string zipCode, string city, string district, string streetDirectionId, string totalSpaces, string parkingZoneId, string parkingRegulationsId, string parkingStandardId, string streetOwnership, string notes)
        {
            var usCulture = CultureInfo.GetCultureInfo("en-US");
            var provider = new ParkingLotProvider();
            var street = provider.GetOrCreateStreet(streetName, zipCode, city, district, streetOwnership);
            provider.CreateParkingLot(new LatLong(decimal.Parse(lat, usCulture), decimal.Parse(lon, usCulture)), street.Id, houseNumber, totalSpaces, parkingZoneId, parkingRegulationsId, parkingStandardId, streetDirectionId, notes);
            return Ok();
        }

        [Route("ReportAvailability")]
        [HttpPost]
        public IHttpActionResult ReportAvailability(string parkingId, string freePlaces, string isApproximate)
        {
            var usCulture = CultureInfo.GetCultureInfo("en-US");
            var provider = new ParkingLotProvider();
            provider.AddAvailabilityReport(int.Parse(parkingId), int.Parse(freePlaces), isApproximate == "1");
            return Ok();
        }

        [Route("UpdateHouseNumber")]
        [HttpPost]
        public IHttpActionResult UpdateHouseNumber(string parkingId, string houseNumber)
        {
            var provider = new ParkingLotProvider();
            if (!string.IsNullOrEmpty(houseNumber))
            {
                provider.UpdateHouseNumber(int.Parse(parkingId), houseNumber);
            }
            return Ok();
        }
    }
}