using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Coded.DataAccess.Entity
{
    public class LatLong
    {
        public decimal Latitude { get; set; }
        public decimal Longitude { get; set; }
        public LatLong(decimal lat, decimal lon)
        {
            Latitude = lat;
            Longitude = lon;
        }
    }
}
