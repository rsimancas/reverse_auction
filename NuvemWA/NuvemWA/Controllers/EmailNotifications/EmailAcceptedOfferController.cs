namespace NuvemWA.Controllers.Register
{
    using NuvemWA.Models;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;
    using System.Web.Mvc;

    public class EmailAcceptedOfferController : Controller
    {
        static readonly IVendorsRepository repoVendors = new VendorsRepository();
        static readonly IQuotesRepository repoQuotes = new QuotesRepository();

        // GET: EmailAcceptedOffer
        public ActionResult Index()
        {
            string errMsg = String.Empty;
            var nvc = Request.QueryString;
            string strQHK = nvc["q"] ?? "0";
            int QHK = Convert.ToInt32(strQHK);
            int VendorKey = Convert.ToInt32(nvc["v"] ?? "0");
            int Winner = Convert.ToInt32(nvc["w"] ?? "0");

            var quote = repoQuotes.Get(QHK, ref errMsg);
            var vendor = repoVendors.Get(VendorKey, ref errMsg);

            var protocol = Request.IsSecureConnection ? "https:" : "http:";
            var host = Request.Url.Host.ToLower();
            var path = Request.Url.AbsolutePath.ToLower().Replace("emailacceptedoffer", "");
            path = host + @"/" + path;
            path = path.Replace(@"//", @"/");
            path = protocol + @"//" + path;

            ViewBag.path = path;

            ViewBag.Customer = quote.CustName;
            ViewBag.Quote = quote;
            ViewBag.Vendor = vendor.VendorName;
            ViewBag.Winner = Winner == 1;

            return View();
        }
    }
}