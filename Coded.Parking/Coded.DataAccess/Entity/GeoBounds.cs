using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Coded.DataAccess.Entity
{
    public class GeoBounds
    {
        public LatLong SouthWest { get; set; }
        public LatLong NorthEast { get; set; }
        public GeoBounds(decimal southWestLat, decimal southWestLon, decimal northEastLat, decimal northEastLon)
        {
            SouthWest = new LatLong(southWestLat, southWestLon);
            NorthEast = new LatLong(northEastLat, northEastLon);
        }
    }
}
