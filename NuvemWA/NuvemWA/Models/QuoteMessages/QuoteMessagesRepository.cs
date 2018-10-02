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

    public class QuoteMessagesRepository : IQuoteMessagesRepository
    {
        #region Quote Messages
        public IList<QuoteMessage> GetList(string query, FieldFilters fieldFilters, Sort sort, int page, int start, int limit, ref int totalRecords)
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

                    if (name == "MessageVendorKey")
                    {
                        where += String.Format(" AND (QMessageFromVendorKey = {0} OR QMessageToVendorKey = {0})", value);
                    }
                    else
                    {
                        if (item.type == "string" || item.type == "date")
                            value = "'" + value + "'";

                        if (item.type == "date")
                            name = String.Format("CAST({0} as DATE)", name);

                        where += String.Format(" AND {0} = {1}", name, value);
                    }
                }
            }
            #endregion Field Filters

            if (!string.IsNullOrEmpty(query))
            {
                string fieldName = "";

                fieldName = "CONVERT(VARCHAR(10), QMessageDate,103)";
                where += (!string.IsNullOrEmpty(where) ? " and " : "") +
                EnumExtension.generateLikeWhere(query, fieldName);
            }

            // Handle Orders
            string order = "QMessageDate";
            string direction = "ASC";

            if (!string.IsNullOrWhiteSpace(sort.property))
            {
                order = sort.property;
                direction = sort.direction;
            }

            string sql = @"WITH qData  AS 
                            (   
	                            SELECT *,
                                ROW_NUMBER() OVER (ORDER BY {2} {3}) as row
                                FROM vQuoteMessages 
                                WHERE {0}
                            )
                            SELECT {4} *, t5.TotalRecords
                            FROM qData
                            CROSS APPLY (select MAX(row) as TotalRecords from qData) as t5
                            WHERE {1}  
                            ORDER BY row ";

            string top = ((@limit > 0) ? String.Format(" TOP {0} ", @limit) : "");
            where = (where.StartsWith("1=1 AND ")) ? where.Replace("1=1 AND ", "") : where;
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

                var data = dt.ToList<QuoteMessage>();
                totalRecords = Convert.ToInt32(dt.Rows[0]["TotalRecords"]);
                return data;
            }
            else
            {
                return null;
            }
        }

        public QuoteMessage Get(int id)
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

        public QuoteMessage Add(QuoteMessage model)
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

            model.QMessageDate = DateTime.Now;
            string sql = "INSERT INTO QuoteMessages ({0}) VALUES ({1}) " +
                "SELECT SCOPE_IDENTITY()";

            EnumExtension.setListValues(model, "QMessageKey", ref sql);

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

        public QuoteMessage Update(QuoteMessage model)
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

            var oldData = Get(model.QMessageKey, oConn);

            string sql = "UPDATE QuoteMessages SET {0} WHERE QMessageKey = @key";

            EnumExtension.setUpdateValues(model, "QMessageKey", ref sql);

            SqlCommand cmd = new SqlCommand(sql, oConn);

            cmd.Parameters.Add("@key", SqlDbType.Int).Value = model.QMessageKey;

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

            var returnData = Get(model.QMessageKey, oConn);

            ConnManager.CloseConn(oConn);

            return returnData;
        }

        private QuoteMessage Get(int id, SqlConnection oConn)
        {
            string sql = @"WITH qData 
                         AS ( 
                         SELECT a.* 
                         FROM vQuoteMessages a 
                         WHERE a.QMessageKey = @key 
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
                var data = dt.ToList<QuoteMessage>();
                return data.FirstOrDefault<QuoteMessage>();
            }

            return null;
        }

        public bool Remove(QuoteMessage model)
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

        private bool Remove(QuoteMessage model, SqlConnection oConn)
        {
            string sql = "DELETE FROM QuoteMessages WHERE (QMessageKey = @key)";

            SqlCommand cmd = new SqlCommand(sql, oConn);
            cmd.Parameters.Add("@key", SqlDbType.Int).Value = model.QMessageKey;

            int number = Convert.ToInt32(cmd.ExecuteNonQuery());

            if (number > 0) return true;

            return false;
        }
        #endregion Quote Messages
    }
}