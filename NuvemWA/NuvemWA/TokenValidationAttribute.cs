using NuvemWA.Models;
using System;
using System.Linq;
using System.Net.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using Utilidades;

namespace NuvemWA
{
    public class TokenValidationAttribute : ActionFilterAttribute
    {
        static readonly IUsersRepository repository = new UsersRepository();

        public override void OnActionExecuting(HttpActionContext actionContext)
        {
            string token;

            try
            {
                token = actionContext.Request.Headers.GetValues("Authorization-Token").First();
            }
            catch (Exception)
            {
                actionContext.Response =
                  new HttpResponseMessage(System.Net.HttpStatusCode.BadRequest)
                  {
                      //Content = new StringContent(actionContext.Request.)
                      Content = new StringContent("Missing Authorization-Token")
                  };
                return;
            }

            try
            {
                string[] split = token.Split(',');

                string usrName = Utils.Decrypt(split[0].Replace(" ", "+"));
                string usrPwd = Utils.Decrypt(split[1]);

                var userLogged = repository.ValidTokenLogon(usrName, usrPwd);

                if (userLogged == null)
                {
                    throw new Exception("Invalid User");
                };

                //AuthorizedUserRepository.GetUsers().First(x => x.Name == RSAClass.Decrypt(token));
                //AuthorizedUserRepository.GetUsers().First(x => x.UserName == token);
                base.OnActionExecuting(actionContext);
            }
            catch (Exception)
            {
                actionContext.Response =
                  new HttpResponseMessage(System.Net.HttpStatusCode.Forbidden)
                  {
                      Content = new StringContent("Unauthorized User")
                  };
                return;
            }
        }
    }
}