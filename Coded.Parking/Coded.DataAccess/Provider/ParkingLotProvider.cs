using Coded.DataAccess.Entity;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Coded.DataAccess.Provider
{
    public class ParkingLotProvider : BaseProveider
    {
        public IList<ParkingLot> GetByBounds(LatLong southWest, LatLong nordEast)
        {
            var result = new List<ParkingLot>();
            using (MySqlConnection connection = new MySqlConnection(ConnectionString))
            {
                connection.Open();

                MySqlCommand command = connection.CreateCommand();
                command.Parameters.AddWithValue("southWestLat", southWest.Latitude);
                command.Parameters.AddWithValue("southWestLon", southWest.Longitude);
                command.Parameters.AddWithValue("nordEastLat", nordEast.Latitude);
                command.Parameters.AddWithValue("nordEastLon", nordEast.Latitude);
                command.CommandText = "select pl.Id,pl.WkbGeometry,av.FreePlaces,pl.Lat,pl.Lon,pl.PlaceNumber,pl.HouseNumber,pl.Notes,pz.Name as ParkingZoneName,pp.Price as ParkingZonePrice, pl.ParkingRegulationId,pl.ParkingStandardId,s.Name as StreetName,s.City,s.District,pl.StreetDirectionId as StreetDirection,s.OwnershipId as StreetOwnership " +
                                      "from parking_lot_copy pl " +
                                      "inner join street s on s.Id = pl.StreetId " +
                                      "left join parking_zone pz on pz.Id = pl.ParkingZoneId " +
                                      "left join parking_price pp on pp.ParkingZoneId = pz.Id and (CURTIME() between pp.From and pp.To) and pp.WeekDay = (CASE WHEN WEEKDAY(NOW()) between 0 and 4 THEN 1 WHEN WEEKDAY(NOW()) = 5 THEN 2 ELSE 3 END) " +
                                      "left join (select av1.ParkingLotId, av1.FreePlaces from availability av1 inner join (select ParkingLotId, MAX(CreatedOn)createdOn from availability where RecordStatusId = 2 group by ParkingLotId) av2 on av1.ParkingLotId = av2.ParkingLotId and av1.CreatedOn = av2.CreatedOn where av1.RecordStatusId = 2) av on av.ParkingLotId = pl.Id " +
                                      "where (pl.Lat between @southWestLat and @nordEastLat) and (pl.Lon between @southWestLon and @nordEastLon)";
                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        var parkingLot = new ParkingLot();
                        parkingLot.Id = Convert.ToInt32(reader["Id"]);
                        parkingLot.WkbGeometry = Convert.ToString(reader["WkbGeometry"]);
                        parkingLot.Latitude = Convert.ToDecimal(reader["Lat"]);
                        parkingLot.Longitude = Convert.ToDecimal(reader["Lon"]);
                        parkingLot.PlaceNumber = Convert.ToInt32(reader["PlaceNumber"]);
                        if (reader["FreePlaces"] == DBNull.Value)
                        {
                            parkingLot.AvailablePlaces = -1;
                        }
                        else
                        {
                            parkingLot.AvailablePlaces = Convert.ToInt32(reader["FreePlaces"]);
                        }
                        parkingLot.Notes = Convert.ToString(reader["Notes"]);
                        var parkingZone = new ParkingZone();
                        parkingZone.Name = Convert.ToString(reader["ParkingZoneName"]);
                        if (reader["ParkingZonePrice"] != DBNull.Value)
                        {
                            parkingZone.Price = Convert.ToDecimal(reader["ParkingZonePrice"]);
                        }
                        if (reader["HouseNumber"] != DBNull.Value)
                        {
                            parkingLot.HouseNumber = Convert.ToString(reader["HouseNumber"]);
                        }
                        parkingLot.ParkingZone = parkingZone;
                        parkingLot.ParkingRegulation = (Enum.ParkingRegulation)Convert.ToInt32(reader["ParkingRegulationId"]);
                        parkingLot.ParkingStandard = (Enum.ParkingStandard)Convert.ToInt32(reader["ParkingStandardId"]);
                        var street = new Street();
                        street.Name = Convert.ToString(reader["StreetName"]);
                        street.City = Convert.ToString(reader["City"]);
                        street.District = Convert.ToString(reader["District"]);
                        street.StreetOwnership = (Enum.StreetOwnership)Convert.ToInt32(reader["StreetOwnership"]);
                        parkingLot.Street = street;
                        parkingLot.StreetDirection = (Enum.StreetDirection)Convert.ToInt32(reader["StreetDirection"]);
                        result.Add(parkingLot);
                    }
                }
            }
            return result;
        }

        public IList<ParkingLot> FindParkingAround(LatLong center, int limit)
        {
            var result = new List<ParkingLot>();
            using (MySqlConnection connection = new MySqlConnection(ConnectionString))
            {
                connection.Open();

                MySqlCommand command = connection.CreateCommand();
                command.Parameters.AddWithValue("myLat", center.Latitude);
                command.Parameters.AddWithValue("myLon", center.Longitude);
                command.Parameters.AddWithValue("limit", limit);
                command.CommandText = "SELECT pl.id, pl.PlaceNumber, av.FreePlaces, pl.Notes, s.Name as StreetName, s.ZipCode, s.City, s.District, pl.HouseNumber, pl.Lat, pl.Lon, (sqrt(power((radians(pl.Lon) - radians(@myLon)) * cos((radians(pl.Lat) + radians(@myLat)) / 2), 2) + power(radians(pl.Lat) - radians(@myLat) , 2)) * 6371) as distance " +
                                      "FROM parking_lot_copy pl " +
                                      "inner join street s on s.Id = pl.StreetId " +
                                      "left join (select av1.ParkingLotId, av1.FreePlaces from availability av1 inner join (select ParkingLotId, MAX(CreatedOn)createdOn from availability where RecordStatusId = 2 group by ParkingLotId) av2 on av1.ParkingLotId = av2.ParkingLotId and av1.CreatedOn = av2.CreatedOn where av1.RecordStatusId = 2) av on av.ParkingLotId = pl.Id " +
                                      "where av.FreePlaces > 0 OR av.FreePlaces is null HAVING distance < 30 ORDER BY distance LIMIT 0, @limit";
                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        var parkingLot = new ParkingLot();
                        parkingLot.Id = Convert.ToInt32(reader["Id"]);
                        parkingLot.PlaceNumber = Convert.ToInt32(reader["PlaceNumber"]);
                        parkingLot.Latitude = Convert.ToDecimal(reader["Lat"]);
                        parkingLot.Longitude = Convert.ToDecimal(reader["Lon"]);
                        if (reader["FreePlaces"] == DBNull.Value)
                        {
                            parkingLot.AvailablePlaces = -1;
                        }
                        else
                        {
                            parkingLot.AvailablePlaces = Convert.ToInt32(reader["FreePlaces"]);
                        }
                        parkingLot.Notes = Convert.ToString(reader["Notes"]);
                        parkingLot.HouseNumber = Convert.ToString(reader["HouseNumber"]);

                        var street = new Street();
                        street.Name = Convert.ToString(reader["StreetName"]);
                        street.City = Convert.ToString(reader["City"]);
                        street.ZipCode = Convert.ToString(reader["ZipCode"]);
                        street.District = Convert.ToString(reader["District"]);
                        parkingLot.Street = street;
                        result.Add(parkingLot);
                    }
                }
            }
            return result;
        }

        public dynamic GetLayerByBounds(LatLong southWest, LatLong nordEast)
        {
            dynamic result = new ExpandoObject();
            result.type = "FeatureCollection";
            result.features = new List<ExpandoObject>();
            using (MySqlConnection connection = new MySqlConnection(ConnectionString))
            {
                connection.Open();

                MySqlCommand command = connection.CreateCommand();
                command.Parameters.AddWithValue("southWestLat", southWest.Latitude);
                command.Parameters.AddWithValue("southWestLon", southWest.Longitude);
                command.Parameters.AddWithValue("nordEastLat", nordEast.Latitude);
                command.Parameters.AddWithValue("nordEastLon", nordEast.Latitude);
                command.CommandText = "select pl.WkbGeometry " +
                                      "from parking_lot_copy pl " +
                                      "where (pl.Lat between @southWestLat and @nordEastLat) and (pl.Lon between @southWestLon and @nordEastLon)";
                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        if (reader["WkbGeometry"] == DBNull.Value)
                        {
                            continue;
                        }
                        dynamic feature = new ExpandoObject();
                        feature.type = "Feature";
                        feature.properties = new ExpandoObject();
                        feature.properties.stroke = 5;
                        feature.geometry = new ExpandoObject();
                        feature.geometry.type = "MultiLineString";
                        feature.geometry.coordinates = new List<List<decimal[]>>();
                        var coordinatesString = Convert.ToString(reader["WkbGeometry"]).Replace("MULTILINESTRING ", "").Replace("(", "").Replace(")", "");
                        var latLong = new List<decimal[]>();
                        foreach (var point in coordinatesString.Split(new string[] { ", " }, StringSplitOptions.RemoveEmptyEntries))
                        {
                            var coordinatePair = point.Split(' ');
                            if (coordinatePair.Length == 2)
                            {
                                latLong.Add(new decimal[] { decimal.Parse(coordinatePair[0], CultureInfo.GetCultureInfo("en-US")), decimal.Parse(coordinatePair[1], CultureInfo.GetCultureInfo("en-US")) });
                            }
                        }
                        feature.geometry.coordinates.Add(latLong);
                        result.features.Add(feature);
                    }
                }
            }
            return result;
        }

        public Street GetOrCreateStreet(string streetName, string zipCode, string city, string district, string ownershipId)
        {
            Street result = null;
            MySqlCommand command = null;
            using (MySqlConnection connection = new MySqlConnection(ConnectionString))
            {
                connection.Open();

                command = connection.CreateCommand();
                command.Parameters.AddWithValue("streetName", streetName);
                command.Parameters.AddWithValue("zipCode", zipCode);
                command.Parameters.AddWithValue("city", city);
                command.Parameters.AddWithValue("district", district);
                command.CommandText = "select Id, Name, Code, ZipCode, City, District, OwnershipId from street where Name = @streetName and (zipCode = @zipCode or @zipCode is null) and (city = @city or @city is null) and (district = @district or @district is null)";
                using (var reader = command.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        result = new Street();
                        result.Id = Convert.ToInt32(reader["Id"]);
                        result.Name = Convert.ToString(reader["Name"]);
                        result.Code = Convert.ToString(reader["Code"]);
                        result.ZipCode = Convert.ToString(reader["ZipCode"]);
                        result.City = Convert.ToString(reader["City"]);
                        result.District = Convert.ToString(reader["District"]);
                        result.StreetOwnership = (Enum.StreetOwnership)Convert.ToInt32(reader["OwnershipId"]);
                    }
                }
                if (result == null)
                {
                    var ownership = (Enum.StreetOwnership)int.Parse(ownershipId);
                    command = connection.CreateCommand();
                    command.Parameters.AddWithValue("streetName", streetName);
                    command.Parameters.AddWithValue("zipCode", zipCode);
                    command.Parameters.AddWithValue("city", city);
                    command.Parameters.AddWithValue("district", district);
                    command.Parameters.AddWithValue("ownershipId", ownership);
                    command.CommandText = "insert into street (Name, Code, ZipCode, City, District, OwnershipId, StatusId) values (@streetName, '', @zipCode, @city, @district, @ownershipId, 1)";
                    command.ExecuteNonQuery();
                    command = connection.CreateCommand();
                    command.CommandText = "Select @@Identity";
                    var id = Convert.ToInt32(command.ExecuteScalar());
                    result = new Street();
                    result.Id = id;
                    result.Name = streetName;
                    result.ZipCode = zipCode;
                    result.City = city;
                    result.District = district;
                    result.StreetOwnership = ownership;
                }
            }
            return result;
        }

        public void CreateParkingLot(LatLong point, int streetId, string houseNumber, string totalSpaces, string parkingZone, string parkingRegulations, string parkingStandard, string streetDirection, string notes)
        {
            using (MySqlConnection connection = new MySqlConnection(ConnectionString))
            {
                connection.Open();

                MySqlCommand command = connection.CreateCommand();
                command.Parameters.AddWithValue("lat", point.Latitude);
                command.Parameters.AddWithValue("lon", point.Longitude);
                command.Parameters.AddWithValue("placeNumber", totalSpaces);
                command.Parameters.AddWithValue("notes", notes);
                command.Parameters.AddWithValue("parkingZoneId", parkingZone);
                command.Parameters.AddWithValue("parkingRegulationId", parkingRegulations);
                command.Parameters.AddWithValue("parkingStandardId", parkingStandard);
                command.Parameters.AddWithValue("streetId", streetId);
                command.Parameters.AddWithValue("streetDirectionId", streetDirection);
                command.Parameters.AddWithValue("houseNumber", houseNumber);
                command.CommandText = "insert into parking_lot_copy (lat, lon, PlaceNumber, HouseNumber, notes, ParkingZoneId, ParkingRegulationId, ParkingStandardId, StreetId, StreetDirectionId, StatusId) " +
                                      "values(@lat, @lon, @placeNumber, @houseNumber, @notes, @parkingZoneId, @parkingRegulationId, @parkingStandardId, @streetId, @streetDirectionId, 1)";
                command.ExecuteNonQuery();
            }
        }

        public void AddAvailabilityReport(int parkingId, int freePlaces, bool isApproximate)
        {
            using (MySqlConnection connection = new MySqlConnection(ConnectionString))
            {
                connection.Open();

                MySqlCommand command = connection.CreateCommand();
                command.Parameters.AddWithValue("ParkingLotId", parkingId);
                command.Parameters.AddWithValue("FreePlaces", freePlaces);
                command.Parameters.AddWithValue("isApproximate", isApproximate);
                command.CommandText = "insert into availability (ParkingLotId, CreatedOn, FreePlaces, IsApproximate, RecordStatusId) " +
                                      "values(@ParkingLotId, NOW(), @FreePlaces, @isApproximate, 2)"; // Always create approved reports
                command.ExecuteNonQuery();
            }
        }

        public ParkingZone GetParkingZone(LatLong point)
        {
            ParkingZone result = null;
            using (MySqlConnection connection = new MySqlConnection(ConnectionString))
            {
                connection.Open();

                MySqlCommand command = connection.CreateCommand();
                command.Parameters.AddWithValue("lat", point.Latitude);
                command.Parameters.AddWithValue("lon", point.Longitude);
                command.CommandText = "select * from (select MBRWithin(ST_GeomFromText(CONCAT('POINT(',@lon, ' ', @lat, ')')), ST_GeomFromText(pz.wkb_geometry)) res, pz.Id, pz.Name, pz.Description " +
                                      "from parking_zone pz where pz.Id != 999) sel where sel.res > 0; ";
                using (var reader = command.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        result = new ParkingZone();
                        result.Id = Convert.ToInt32(reader["Id"]);
                        result.Name = Convert.ToString(reader["Name"]);
                        result.Description = Convert.ToString(reader["Description"]);
                    }
                }
            }
            return result;
        }

        public void UpdateHouseNumber(int parkingId, string houseNumber)
        {
            using (MySqlConnection connection = new MySqlConnection(ConnectionString))
            {
                connection.Open();

                MySqlCommand command = connection.CreateCommand();
                command.Parameters.AddWithValue("ParkingLotId", parkingId);
                command.Parameters.AddWithValue("HouseNumber", houseNumber);
                command.CommandText = "update parking_lot_copy set HouseNumber = @HouseNumber " +
                                      "where Id = @ParkingLotId and HouseNumber is null"; // Always create approved reports
                command.ExecuteNonQuery();
            }
        }
    }
}
