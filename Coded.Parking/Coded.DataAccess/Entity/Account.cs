using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Coded.DataAccess.Entity
{
    public class Account
    {
        [JsonProperty("Login")]
        public string Login { get; set; }  
        [JsonProperty("Password")]
        public string Password { get; set; }
        [JsonProperty("FirstName")]
        public string FirstName { get; set; }
        [JsonProperty("LastName")]
        public string LastName { get; set; }
        [JsonProperty("Email")]
        public string Email { get; set; }  
    }
}
