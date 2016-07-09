using Coded.DataAccess.Provider;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace Coded.Presentation.Controllers
{
    [RoutePrefix("api/Address")]
    public class AddressController : ApiController
    {
        [Route("GetAll")]
        public IHttpActionResult GetAllAddresses()
        {
            var provider = new AddressProvider();
            var addresses = provider.GetAllAddresses();
            return Json(addresses);
        }

        [Route("GetBounds")]
        public IHttpActionResult GetBoundsByAddress(string streetName, string zipCode, string district, string city)
        {
            var provider = new AddressProvider();
            var bounds = provider.GetBoundsByAddress(streetName, zipCode, district, city);
            return Json(bounds);
        }
    }
}