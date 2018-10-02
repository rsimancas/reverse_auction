using NuvemWA.Models;
using Newtonsoft.Json.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Utilidades;
using System.Web;

namespace NuvemWA.Controllers
{
    [AllowAnonymous]
    public class RegisterController : ApiController
    {
        static readonly IUsersRepository userRepository = new UsersRepository();

        [HttpPost]
        public object PostAuth(UserSignup data)
        {
            string userEmail = data.UserEmail;

            if (userRepository.CheckIfExists(userEmail))
            {
                return new
                {
                    message = "User Exists",
                    success = false
                };
            }

            string message = "User Created";
            object json;

            bool registered = userRepository.CreateUser(data, ref message);

            json = new
            {
                message = message,
                success = registered
            };

            return json;
        }
    }
}