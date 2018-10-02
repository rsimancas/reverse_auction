namespace NuvemWA.Models
{
    using Helpers;
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Data.SqlClient;
    using System.Linq;
    using System.Reflection;
    using Utilidades;

    public class QuotesRepository : IQuotesRepository
    {
        #region Quote Header
        public IList<QuoteHeader> GetList(string query, Filter filter, Sort sort, int page, int start, int limit, ref int totalRecords, ref string errMsg)
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
            int VendorKey = 0;

            #region Filtros
            if (!string.IsNullOrWhiteSpace(filter.property))
            {
                if (filter.property == "VendorKey")
                {
                    VendorKey = Convert.ToInt32(filter.value);
                    if (VendorKey > 0)
                    {
                        where += String.Format(" AND QHeaderDraft = 0 AND TotalItems > 0 ");
                    }
                }
                else
                {
                    where += String.Format(" and {0} = {1}", filter.property, filter.value);
                }
            }
            #endregion Filtros

            if (!string.IsNullOrEmpty(query))
            {
                string fieldName = "";

                fieldName = "CONVERT(VARCHAR(10), QHeaderDateBegin,103)";
                where += (!string.IsNullOrEmpty(where) ? " and " : "") +
                EnumExtension.generateLikeWhere(query, fieldName);
            }

            // Handle Orders
            string order = "QHeaderDateBegin";
            string direction = "DESC";

            if (!string.IsNullOrWhiteSpace(sort.property))
            {
                order = sort.property;
                direction = sort.direction;
            }

            string top = (@limit>0) ? String.Format(" TOP {0} ", @limit) : "";

            string sql = @"WITH qData  AS 
                            (   
	                            SELECT *, 
                                ROW_NUMBER() OVER (ORDER BY {2} {3}) as row
                                FROM vQuoteHeaders 
                                WHERE {0}
                            )
                            SELECT {4} a.*, Records.Total as TotalRecords
                               ,Interested.Total as Interested
                               ,Offers.Total as Offers
                               ,CAST((CASE WHEN OS.QOfferStatus = 2 THEN 1 ELSE 0 END) AS BIT) as wasDesisted
                            FROM qData a
                            CROSS APPLY (select MAX(row) as Total from qData) as Records
                            CROSS APPLY (select count(*) as Total from (select distinct QHeaderKey,QMessageFromVendorKey from QuoteMessages) as c where c.QHeaderKey = a.QHeaderKey and c.QMessageFromVendorKey IS NOT NULL) as Interested
                            CROSS APPLY (select count(*) as Total from (select distinct QHeaderKey,VendorKey from QuoteOffers) as c where c.QHeaderKey = a.QHeaderKey) as Offers
                            OUTER APPLY (select MAX(QOfferStatus) as QOfferStatus from QuoteOffers QO WHERE QO.QHeaderKey = a.QHeaderKey AND QO.VendorKey = @VendorKey) as OS
                            WHERE {1}  
                            ORDER BY row ";

            where = (where.StartsWith("1=1 AND ")) ? where.Replace("1=1 AND ","") : where;
            sql = String.Format(sql, where, wherepage, order, direction, top);

            SqlDataAdapter da = new SqlDataAdapter(sql, oConn);
            da.SelectCommand.Parameters.Add("@VendorKey", SqlDbType.Int).Value = VendorKey;

            DataSet ds = new DataSet();

            try
            {
                da.Fill(ds);
            }
            catch (Exception ex)
            {
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                errMsg = ex.Message;
                return null;
            }

            ConnManager.CloseConn(oConn);

            DataTable dt;
            dt = ds.Tables[0];

            totalRecords = dt.Rows.Count;

            if (totalRecords > 0)
            {

                IList<QuoteHeader> data = dt.ToList<QuoteHeader>();
                totalRecords = Convert.ToInt32(dt.Rows[0]["TotalRecords"]);
                return data;
            }
            else
            {
                return null;
            }
        }

        public QuoteHeader Get(int id, ref string msgError)
        {
            SqlConnection oConn = null;

            try
            {
                oConn = ConnManager.OpenConn();
            }
            catch (Exception ex)
            {
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                msgError = ex.Message;
                return null;
            };

            QuoteHeader data = Get(id, oConn);

            ConnManager.CloseConn(oConn);

            return data;
        }

        public QuoteHeader Add(QuoteHeader data, ref string msgError)
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

            data.QHeaderCreatedDate = DateTime.Now;
            string sql = "INSERT INTO QuoteHeaders ({0}) VALUES ({1}) " +
                "SELECT SCOPE_IDENTITY()";

            EnumExtension.setListValues(data, "QHeaderKey", ref sql);

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
                msgError = ex.Message;
                return null;
            }

            QuoteHeader returnData = Get(keyGenerated, oConn);

            ConnManager.CloseConn(oConn);

            return returnData;
        }

        public QuoteHeader Update(QuoteHeader data, ref string msgError)
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

            QuoteHeader oldData = Get(data.QHeaderKey, oConn);

            data.QHeaderModifiedDate = DateTime.Now;
            string sql = "UPDATE QuoteHeaders SET {0} WHERE QHeaderKey = @key";

            EnumExtension.setUpdateValues(data, "QHeaderKey", ref sql);

            SqlCommand cmd = new SqlCommand(sql, oConn);

            cmd.Parameters.Add("@key", SqlDbType.Int).Value = data.QHeaderKey;

            try
            {
                cmd.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                ConnManager.CloseConn(oConn);
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                msgError = ex.Message;
                return null;
            }

            QuoteHeader returnData = Get(data.QHeaderKey, oConn);

            ConnManager.CloseConn(oConn);

            return returnData;
        }

        private QuoteHeader Get(int id, SqlConnection oConn)
        {
            string sql = @"WITH qData 
                         AS ( 
                         SELECT a.* 
                         FROM vQuoteHeaders a 
                         WHERE a.QHeaderKey = @id 
                         ) 
                        SELECT * 
                        FROM qData ";

            SqlDataAdapter da = new SqlDataAdapter(sql, oConn);

            da.SelectCommand.Parameters.Add("@id", SqlDbType.Int).Value = Convert.ToInt32(id);

            DataSet ds = new DataSet();

            da.Fill(ds);

            DataTable dt;
            dt = ds.Tables[0];

            if (dt.Rows.Count > 0)
            {
                IList<QuoteHeader> data = dt.ToList<QuoteHeader>();
                return data.FirstOrDefault<QuoteHeader>();
            }

            return null;
        }

        public bool Remove(QuoteHeader data, ref string msgError)
        {
            SqlConnection oConn = null;

            try
            {
                oConn = ConnManager.OpenConn();
            }
            catch (Exception ex)
            {
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                msgError = ex.Message;
                return false;
            };

            bool result;
            try
            {
                result = RemoveHeader(data, oConn);
            }
            catch (Exception ex)
            {
                ConnManager.CloseConn(oConn);
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                return false;
            }

            ConnManager.CloseConn(oConn);

            return result;
        }

        private bool RemoveHeader(QuoteHeader data, SqlConnection oConn)
        {
            string sql = "DELETE FROM QuoteHeaders " +
                         " WHERE (QHeaderKey = {0})";

            sql = String.Format(sql, data.QHeaderKey);

            SqlCommand cmd = new SqlCommand(sql, oConn);

            int number = Convert.ToInt32(cmd.ExecuteNonQuery());

            if (number > 0) return true;

            return false;
        }
        #endregion Quote Header
    }
}