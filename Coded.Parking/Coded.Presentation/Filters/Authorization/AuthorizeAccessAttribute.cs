using Coded.DataAccess.Entity;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading;
using System.Web;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;

namespace Coded.Presentation.Filters.Authorization
{
    public class AuthorizeAccessAttribute: AuthorizationFilterAttribute
    {
        protected const string AuthorizationExceptionMessage = "The current user does not have access to the requested function";

        public override void OnAuthorization(HttpActionContext actionContext)
        {
            var ctrl = actionContext.ControllerContext.Controller as ApiController;
            IsApiBaseController(ctrl);
            IsAuthenticated(ctrl);
            var auth = actionContext.Request.Headers.Authorization;
            if (auth != null && string.Compare(auth.Scheme, "Bearer", StringComparison.OrdinalIgnoreCase) == 0)
            {
                var encryptedAccount = EncryptionHelper.Decrypt(auth.Parameter);
                var account = (Account)JsonConvert.DeserializeObject(encryptedAccount, typeof(Account));
                if (account != null)
                {
                    Thread.CurrentPrincipal = actionContext.ControllerContext.RequestContext.Principal = new GenericPrincipal(new GenericIdentity(account.Login, "Bearer"), new string[0]);
                }
                else
                {
                    throw new Exception(AuthorizationExceptionMessage);
                }
            }
        }

        protected static void IsApiBaseController(ApiController ctrl)
        {
            if (ctrl == null)
                throw new Exception("Operation is used on a non-ApiBaseController");
        }

        protected static void IsAuthenticated(ApiController ctrl)
        {
            if (!string.IsNullOrEmpty(ctrl.User.Identity.Name))
                throw new Exception("The current user is not authenticated");
        }
    }
}