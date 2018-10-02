using System;
using System.Web;
using System.Web.Mvc;
using Utilidades;
using NuvemWA.Models;
using System.Reflection;
using System.IO;
using NuvemWA.Clases;

namespace NuvemWA.Controllers
{
    public class ActivationController : Controller
    {
        static readonly IUsersRepository repository = new UsersRepository();
        public ActionResult Index()
        {
            var nvc = Request.QueryString;
            string token = nvc["t"];

            if (string.IsNullOrEmpty(token))
                return View("Error");

            try
            {
                string[] split = token.Split(',');
                string userPWD = Utils.Decrypt(split[1]);
                string userEmail = Utils.Decrypt(split[0].Replace(" ","+"));
                

                if (repository.ActivateUser(userEmail, userPWD))
                {
                    return View();
                }
                else
                {
                    return View("Error");
                }
            }
            catch (Exception ex)
            {
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                return View("Error");
            }
        }

        public ActionResult Foo()
        {
            return View();
        }
    }
}
