using Coded.DataAccess.Entity;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Coded.DataAccess.Provider
{
    public class AddressProvider : BaseProveider
    {
        public IList<Address> GetAllAddresses()
        {
            var result = new List<Address>();
            using (MySqlConnection connection = new MySqlConnection(ConnectionString))
            {
                connection.Open();

                MySqlCommand command = connection.CreateCommand();
                command.CommandText = "select COUNT(p.Id) park_count, s.Name, s.City, s.ZipCode, s.District from parking_lot_copy p inner join street s on s.Id = p.StreetId group by s.Name, s.City, s.ZipCode, s.District";
                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        var address = new Address();
                        address.StreetName = Convert.ToString(reader["Name"]);
                        address.City = Convert.ToString(reader["City"]);
                        address.ZipCode = Convert.ToString(reader["ZipCode"]);
                        address.District = Convert.ToString(reader["District"]);
                        address.ParkingCount = Convert.ToInt32(reader["park_count"]);
                        result.Add(address);
                    }
                }
            }
            return result;
        }

        public GeoBounds GetBoundsByAddress(string streetName, string zipCode, string district, string city)
        {
            GeoBounds result = null;
            MySqlCommand command = null;
            using (MySqlConnection connection = new MySqlConnection(ConnectionString))
            {
                connection.Open();

                command = connection.CreateCommand();
                command.Parameters.AddWithValue("streetName", streetName);
                command.Parameters.AddWithValue("zipCode", zipCode);
                command.Parameters.AddWithValue("city", city);
                command.Parameters.AddWithValue("district", district);
                command.CommandText = "select Min(p.Lat) southWestLat, Min(p.Lon) southWestLon, Max(p.Lat) northEastLat, Max(p.Lon) northEastLon from street s inner join parking_lot_copy p on s.Id = p.StreetId where s.Name = @streetName and (s.zipCode = @zipCode or @zipCode is null) and (s.city = @city or @city is null) and (s.district = @district or @district is null)";
                using (var reader = command.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        result = new GeoBounds(Convert.ToDecimal(reader["southWestLat"]),
                                               Convert.ToDecimal(reader["southWestLon"]),
                                               Convert.ToDecimal(reader["northEastLat"]),
                                               Convert.ToDecimal(reader["northEastLon"]));

                    }
                }
            }
            return result;
        }
    }
}
