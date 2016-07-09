using Coded.DataAccess.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Coded.DataAccess.Entity
{
    public class Street
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public string ZipCode { get; set; }
        public string City { get; set; }
        public string District { get; set; }
        public StreetOwnership StreetOwnership { get; set; }
    }
}
