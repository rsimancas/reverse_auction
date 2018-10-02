using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace NuvemWA.Controllers.Register
{
    public class EmailActivationController : Controller
    {
        // GET: EmailActivation
        public ActionResult Index()
        {
            var nvc = Request.QueryString;
            string token = nvc["token"] ?? "";

            var protocol = Request.IsSecureConnection ? "https:" : "http:";
            var host = Request.Url.Host.ToLower();
            var path = Request.Url.AbsolutePath.ToLower().Replace("emailactivation", "");
            path = host + @"/" + path + @"/Activation";
            path = path.Replace(@"//", @"/");
            path = protocol + @"//" + path;

            ViewBag.path = path;
            ViewBag.pathToken = path + "?t=" + Uri.EscapeUriString(token);
            return View();
        }
    }
}