using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using NuvemWA.Models;
using System;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using Utilidades;

namespace NuvemWA.Controllers
{
    [AllowAnonymous]
    public class AuthController : ApiController
    {
        static readonly IUsersRepository userRepository = new UsersRepository();

        [HttpPost]
        public HttpResponseMessage PostAuth(JObject jsonRequest)
        {

            #region Geolocation 
            //var nvc = HttpContext.Current.Request.Headers;
            //string localeAPIURL = "http://www.freegeoip.net/json/190.37.69.163";
            ////string localeAPIURL = string.Format("http://www.freegeoip.net/json/{0}", HttpContext.Current.Request.UserHostAddress);
            //var json_data = string.Empty;
            
            //using (var w = new WebClient())
            //{
            //    // attempt to download JSON data as a string
            //    try
            //    {
            //        json_data = w.DownloadString(localeAPIURL);
            //    }
            //    catch (Exception ex) {  }
            //}

            //if (!String.IsNullOrEmpty(json_data))
            //{
            //    var usrLocation = JsonConvert.DeserializeObject<UserLocation>(json_data);
            //}
            #endregion Geolocation


            var userName = (string)jsonRequest["data"]["UserEmail"];
            var userPassword = (string)jsonRequest["data"]["UserPassword"];

            var userLogged = userRepository.ValidLogon(userName, userPassword);


            if (userLogged == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, "No Existe");
            }

            string token = userRepository.GenToken(userName, userPassword);

            // Si es el primer logon del usuario apagamos la opcion en base da datos
            if (userLogged.UserFirstLogon)
            {
                userRepository.FirstLogonOff(userLogged.UserKey);
            }

            // Limpiamos el password para no devolverlo como objeto
            userLogged.UserPassword = "";

            object json = new
            {
                data = userLogged,
                security = token
            };

            return Request.CreateResponse(HttpStatusCode.OK, json);
        }
    }
}