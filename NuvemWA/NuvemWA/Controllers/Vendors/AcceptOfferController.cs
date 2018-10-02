using NuvemWA.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Reflection;
using System.Web.Http;
using Utilidades;
using NuvemWA.Clases;

namespace NuvemWA.Controllers
{

    [TokenValidation]
    public class AcceptOfferController : ApiController
    {
        static readonly IQuoteOffersRepository repository = new QuoteOffersRepository();

        public object GetAll()
        {
            return new 
                {
                    total = 1,
                    success = true
                };
        }

        public object Post(AcceptedOffer model)
        {
            object json;

            try
            {
                var posted = repository.AcceptOffer(model.QOfferKey);

                json = new
                {
                    total = 1,
                    data = posted,
                    success = true
                };
            }
            catch (Exception ex)
            {
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);

                json = new
                {
                    message = ex.Message,
                    success = false
                };
            };

            return json;
        }

        public object Put(int id)
        {
            return new
            {
                total = 1,
                success = true
            };
        }

        public object Delete(int id)
        {
            return new
            {
                total = 1,
                success = true
            };
        }
    }
}