namespace NuvemWA.Models
{
    using Helpers;
    using NuvemWA.Clases;
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Data.SqlClient;
    using System.Linq;
    using System.Reflection;
    using Utilidades;
    using System.Net;
    using System.Net.Mail;
    using System.Web;
    using System.Threading;
    using System.Threading.Tasks;
    using Newtonsoft.Json;

    public class QuoteOffersRepository : IQuoteOffersRepository
    {
        static readonly IVendorsRepository repoVendor = new VendorsRepository();

        #region Quote Offers
        public IList<QuoteOffer> GetList(string query, FieldFilters fieldFilters, Sort sort, int page, int start, int limit, ref int totalRecords)
        {
            SqlConnection oConn = null;

            try
            {
                oConn = ConnManager.OpenConn();
            }
            catch (Exception ex)
            {
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                throw;
            };

            string wherepage = (page != 0) ? String.Format("row>{0}", start) : "1=1";
            string where = "1=1";

            #region Field Filters
            if (fieldFilters.fields != null && fieldFilters.fields.Count > 0)
            {
                foreach (var item in fieldFilters.fields)
                {
                    string value = item.value;
                    string name = item.name;

                    if (item.type == "string" || item.type == "date")
                        value = "'" + value + "'";

                    if (item.type == "date")
                        name = String.Format("CAST({0} as DATE)", name);

                    where += String.Format(" AND {0} = {1}", name, value);
                }
            }
            #endregion Field Filters

            if (!string.IsNullOrEmpty(query))
            {
                string fieldName = "";

                fieldName = "CONVERT(VARCHAR(10),QOfferDeliveryDate,103)";
                where += (!string.IsNullOrEmpty(where) ? " and " : "") +
                EnumExtension.generateLikeWhere(query, fieldName);
            }

            // Handle Orders
            string order = "QOfferDeliveryDate";
            string direction = "DESC";

            if (!string.IsNullOrWhiteSpace(sort.property))
            {
                order = sort.property;
                direction = sort.direction;
            }

            string sql = @"WITH qData  AS 
                            (   
	                            SELECT *,
                                ROW_NUMBER() OVER (ORDER BY {2} {3}) as row
                                FROM vQuoteOffers 
                                WHERE {0}
                            )
                            SELECT {4} *, t5.TotalRecords
                            FROM qData
                            CROSS APPLY (select MAX(row) as TotalRecords from qData) as t5
                            WHERE {1}  
                            ORDER BY row ";

            string top = ((limit > 0) ? String.Format(" TOP {0} ", limit) : "");
            where = (where.StartsWith("1=1 AND ")) ? where.Replace("1=1 AND ","") : where;
            sql = String.Format(sql, where, wherepage, order, direction, top);

            SqlDataAdapter da = new SqlDataAdapter(sql, oConn);

            DataSet ds = new DataSet();

            try
            {
                da.Fill(ds);
            }
            catch (Exception ex)
            {
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                throw;
            }

            ConnManager.CloseConn(oConn);

            DataTable dt;
            dt = ds.Tables[0];

            totalRecords = dt.Rows.Count;

            if (totalRecords > 0)
            {

                var data = dt.ToList<QuoteOffer>();
                totalRecords = Convert.ToInt32(dt.Rows[0]["TotalRecords"]);
                return data;
            }
            else
            {
                return null;
            }
        }

        private IList<QuoteInterested> GetListInterestedByQuote(int QHeaderKey)
        {
            SqlConnection oConn = null;

            try
            {
                oConn = ConnManager.OpenConn();
            }
            catch (Exception ex)
            {
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                throw;
            };

            // Handle Orders
            //string order = "VendorKey";
            //string direction = "ASC";

            string sql = @"WITH qData  AS 
                            (   
	                            SELECT a.QHeaderKey, a.VendorKey, a.VendorName, b.VendorEmail, UserEmail, UserName, 0 as Type
                                    FROM vQuoteOffers a
                                    INNER JOIN Vendors b ON a.VendorKey = b.VendorKey
                                    LEFT OUTER JOIN Users c ON a.VendorKey = c.VendorKey
                                WHERE QHeaderKey = @QHeaderKey
                                UNION
                                SELECT a.QHeaderKey, a.QMessageFromVendorKey as VendorKey, b.VendorName, b.VendorEmail, c.UserEmail, c.UserName, 1 as Type
                                    FROM vQuoteMessages a 
                                    INNER JOIN Vendors b ON a.QMessageFromVendorKey = b.VendorKey
                                    LEFT OUTER JOIN Users c ON b.VendorKey = c.VendorKey
                                WHERE QHeaderKey = @QHeaderKey
                            )
                            SELECT DISTINCT QHeaderKey, VendorKey, VendorName, VendorEmail, UserEmail, UserName
                            FROM qData";

            //sql = String.Format(sql, where, order, direction);

            SqlDataAdapter da = new SqlDataAdapter(sql, oConn);
            da.SelectCommand.Parameters.Add("@QHeaderKey", SqlDbType.Int).Value = QHeaderKey;

            DataSet ds = new DataSet();

            try
            {
                da.Fill(ds);
            }
            catch (Exception ex)
            {
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                throw;
            }

            ConnManager.CloseConn(oConn);

            DataTable dt;
            dt = ds.Tables[0];

            if (dt.Rows.Count > 0)
            {

                var data = dt.ToList<QuoteInterested>();
                return data;
            }
            else
            {
                return new List<QuoteInterested>();
            }
        }

        public QuoteOffer Get(int id)
        {
            SqlConnection oConn = null;

            try
            {
                oConn = ConnManager.OpenConn();
            }
            catch (Exception ex)
            {
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                throw;
            };

            var data = Get(id, oConn);

            ConnManager.CloseConn(oConn);

            return data;
        }

        public QuoteOffer Add(QuoteOffer model)
        {
            SqlConnection oConn = null;

            try
            {
                oConn = ConnManager.OpenConn();
            }
            catch (Exception ex)
            {
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                throw;
            };

            model.QOfferCreatedDate = DateTime.Now;
            string sql = "INSERT INTO QuoteOffers ({0}) VALUES ({1}) " +
                "SELECT SCOPE_IDENTITY()";

            EnumExtension.setListValues(model, "QOfferKey", ref sql);

            SqlCommand cmd = new SqlCommand(sql, oConn);

            int keyGenerated = 0;

            try
            {
                keyGenerated = Convert.ToInt32(cmd.ExecuteScalar());
            }
            catch (Exception ex)
            {
                ConnManager.CloseConn(oConn);
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                throw;
            }

            var returnData = Get(keyGenerated, oConn);

            ConnManager.CloseConn(oConn);

            return returnData;
        }

        public QuoteOffer Update(QuoteOffer model)
        {
            SqlConnection oConn = null;

            try
            {
                oConn = ConnManager.OpenConn();
            }
            catch (Exception ex)
            {
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                throw;
            };

            var oldData = Get(model.QOfferKey, oConn);

            string sql = "UPDATE QuoteOffers SET {0} WHERE QOfferKey = @key";

            EnumExtension.setUpdateValues(model, "QOfferKey", ref sql);

            SqlCommand cmd = new SqlCommand(sql, oConn);

            cmd.Parameters.Add("@key", SqlDbType.Int).Value = model.QOfferKey;

            try
            {
                cmd.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                ConnManager.CloseConn(oConn);
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                throw;
            }

            var returnData = Get(model.QOfferKey, oConn);

            ConnManager.CloseConn(oConn);

            return returnData;
        }

        private QuoteOffer Get(int id, SqlConnection oConn)
        {
            string sql = @"WITH qData 
                         AS ( 
                         SELECT a.* 
                         FROM vQuoteOffers a 
                         WHERE a.QOfferKey = @key 
                         ) 
                        SELECT * 
                        FROM qData ";

            SqlDataAdapter da = new SqlDataAdapter(sql, oConn);

            da.SelectCommand.Parameters.Add("@key", SqlDbType.Int).Value = Convert.ToInt32(id);

            DataSet ds = new DataSet();

            da.Fill(ds);

            DataTable dt;
            dt = ds.Tables[0];

            if (dt.Rows.Count > 0)
            {
                var data = dt.ToList<QuoteOffer>();
                return data.FirstOrDefault<QuoteOffer>();
            }

            return null;
        }

        public bool Remove(QuoteOffer model)
        {
            SqlConnection oConn = null;

            try
            {
                oConn = ConnManager.OpenConn();
            }
            catch (Exception ex)
            {
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                throw;
            };

            bool result;
            try
            {
                result = Remove(model, oConn);
            }
            catch (Exception ex)
            {
                ConnManager.CloseConn(oConn);
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                throw;
            }

            ConnManager.CloseConn(oConn);

            return result;
        }

        private bool Remove(QuoteOffer model, SqlConnection oConn)
        {
            string sql = "DELETE FROM QuoteOffers WHERE (QOfferKey = @key)";

            SqlCommand cmd = new SqlCommand(sql, oConn);
            cmd.Parameters.Add("@key", SqlDbType.Int).Value = model.QOfferKey;

            int number = Convert.ToInt32(cmd.ExecuteNonQuery());

            if (number > 0) return true;

            return false;
        }
        #endregion Quote Offers

        #region Accept Offer
        public QuoteOffer AcceptOffer(int QOfferKey)
        {
            var model = Get(QOfferKey);
            var QHeaderKey = model.QHeaderKey;

            SqlConnection oConn = null;

            try
            {
                oConn = ConnManager.OpenConn();
            }
            catch (Exception ex)
            {
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                throw;
            };

            string sql = "sp_AcceptOffer";

            SqlDataAdapter da = new SqlDataAdapter(sql, oConn);
            da.SelectCommand.Parameters.Add("QOfferKey", SqlDbType.Int).Value = QOfferKey;
            da.SelectCommand.Parameters.Add("QHeaderKey", SqlDbType.Int).Value = QHeaderKey;
            da.SelectCommand.CommandType = CommandType.StoredProcedure;

            DataSet ds = new DataSet();

            try
            {
                da.Fill(ds);
            }
            catch (Exception ex)
            {
                ConnManager.CloseConn(oConn);
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                throw;
            }

            ConnManager.CloseConn(oConn);

            DataTable dt;
            dt = ds.Tables[0];
            var data = new QuoteOffer();

            if (dt.Rows.Count > 0)
            {
                data = dt.ToList<QuoteOffer>().FirstOrDefault();
            }
            else
            {
                throw new Exception("No records found");
            }

            try
            {
                SendNotifications(data);
             }
            catch (Exception ex)
            {
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                //throw;
            }

            return data;
        }

        public void SendNotifications(QuoteOffer model) {
            var lista = GetListInterestedByQuote(model.QHeaderKey);

            foreach (var item in lista.Where(w => w.VendorKey != model.VendorKey).ToList())
            {
                SendMailToVendors(item);
                Thread.Sleep(3000);
            }

            SendMailToWinner(lista.Where(w => w.VendorKey == model.VendorKey).FirstOrDefault(), model);

        }

        private void SendMailToWinner(QuoteInterested model, QuoteOffer offer)
        {
            try
            {
                string errMsg = String.Empty;

                NuvemMailMessage msg = new NuvemMailMessage();
                List<string> Emails = new List<string>();

                string subject = "Nuvem B2B";

                if (!string.IsNullOrEmpty(model.VendorEmail))
                    Emails.Add(model.VendorEmail);

                if (!string.IsNullOrEmpty(model.UserEmail))
                    Emails.Add(model.UserEmail);

                if (string.IsNullOrEmpty(model.VendorEmail) && string.IsNullOrEmpty(model.UserEmail))
                {
                    return;
                }

                string from = "Nuvem Notification Services";

                /* Si deseamos Adjuntar algún archivo*/
                //mnsj.Attachments.Add(new Attachment(pdfFile));
                string msj = "";

                using (WebClient client = new WebClient())
                {
                    var protocol = HttpContext.Current.Request.IsSecureConnection ? "https:" : "http:";
                    var path = HttpContext.Current.Request.Url.AbsolutePath;
                    var port = HttpContext.Current.Request.Url.Port;
                    var host = HttpContext.Current.Request.Url.Host + ((port == 80) ? "" : ":" + port.ToString());

                    path = host + @"/" + path.Substring(0, path.IndexOf(@"api/")) + @"/EmailAcceptedOffer";
                    path = path.Replace(@"//", @"/");
                    path = protocol + @"//" + path;
                    var url = path + string.Format("?q={0}&v={1}&w=1", model.QHeaderKey, model.VendorKey);

                    msj = client.DownloadString(url);
                }

                MailHelper.SendToEnqueue(subject, Emails, msj, from);

                var bc = new BroadcastMessage();
                bc.CommandType = "Notification";
                bc.CommandText = JsonConvert.SerializeObject(offer);
                SignalRHelper.SendData(bc);

            }
            catch (Exception ex)
            {
                while (ex != null)
                {
                    LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                    ex = ex.InnerException;
                }
            }
        }

        private void SendMailToVendors(QuoteInterested model)
        {
            try
            {
                string errMsg = String.Empty;

                NuvemMailMessage msg = new NuvemMailMessage();
                List<string> Emails = new List<string>(); 

                string subject = "Nuvem B2B";

                if(!string.IsNullOrEmpty(model.VendorEmail))
                    Emails.Add(model.VendorEmail);

                if (!string.IsNullOrEmpty(model.UserEmail))
                    Emails.Add(model.UserEmail);

                if (string.IsNullOrEmpty(model.VendorEmail) && string.IsNullOrEmpty(model.UserEmail))
                {
                    return;
                }

                string from = "Nuvem Notification Services";

                /* Si deseamos Adjuntar algún archivo*/
                //mnsj.Attachments.Add(new Attachment(pdfFile));
                string msj = "";

                using (WebClient client = new WebClient())
                {
                    var protocol = HttpContext.Current.Request.IsSecureConnection ? "https:" : "http:";
                    var path = HttpContext.Current.Request.Url.AbsolutePath;
                    var port = HttpContext.Current.Request.Url.Port;
                    var host = HttpContext.Current.Request.Url.Host + ((port == 80) ? "" : ":" + port.ToString());

                    path = host + @"/" + path.Substring(0, path.IndexOf(@"api/")) + @"/EmailAcceptedOffer";
                    path = path.Replace(@"//", @"/");
                    path = protocol + @"//" + path;
                    var url = path + string.Format("?q={0}&v={1}", model.QHeaderKey, model.VendorKey);

                    msj = client.DownloadString(url);
                }

                MailHelper.SendToEnqueue(subject, Emails, msj, from);
            }
            catch (Exception ex)
            {
                while (ex != null)
                {
                    LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                    ex = ex.InnerException;
                }
            }
        }
        #endregion Accept Offer
    }
}