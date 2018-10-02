using Helpers;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Reflection;
using Utilidades;

namespace NuvemWA.Models
{
    public class QuoteHistoryRepository : IQuoteHistoryRepository
    {
        public IList<QHistory> GetList(string query, Sort sort, int page, int start, int limit, ref int totalRecords, ref string errMsg)
        {
            limit = limit + start;

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

            string wherepage = (page != 0) ? String.Format("row>{0} and row<={1} ", start, limit) : "1=1";
            string where = "1=1";

            if (!string.IsNullOrEmpty(query))
            {
                string fieldName = "a.RoleName";
                where += (!string.IsNullOrEmpty(where) ? " and " : "") +
                    EnumExtension.generateLikeWhere(query, fieldName);
            }

            // Handle Order
            string order = "a.QHistoryKey";
            string direction = "ASC";

            if (!string.IsNullOrWhiteSpace(sort.property))
            {
                order = sort.property;
                direction = sort.direction;
            }

            string sql = "SELECT * FROM ( " +
                         "SELECT a.*, " +
                         "  ROW_NUMBER() OVER (ORDER BY {2} {3}) as row,  " +
                         "  IsNull((select count(*) from Roles a WHERE {0}),0)  as TotalRecords   " +
                         " FROM QuoteHistory a WHERE {0}) a  " +
                         " WHERE {1} " +
                         " ORDER BY row";

            sql = String.Format(sql, where, wherepage, order, direction);

            SqlDataAdapter da = new SqlDataAdapter(sql, oConn);

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

                IList<QHistory> data = dt.ToList<QHistory>();
                totalRecords = Convert.ToInt32(dt.Rows[0]["TotalRecords"]);
                return data;
            }
            else
            {
                return null;
            }
        }

        public QHistory Get(int id, ref string msgError)
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

            QHistory data = Get(id, oConn);

            ConnManager.CloseConn(oConn);

            return data;
        }

        public QHistory Add(QHistory data, ref string msgError)
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

            string sql = "INSERT INTO QuoteHistory ({0}) VALUES ({1}) " +
                "SELECT SCOPE_IDENTITY()";

            EnumExtension.setListValues(data, "QHistoryKey", ref sql);

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

            QHistory returnData = Get(keyGenerated, oConn);

            ConnManager.CloseConn(oConn);

            return returnData;
        }

        public QHistory Update(QHistory data, ref string msgError)
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

            string sql = "UPDATE QuoteHistory SET {0} WHERE QHistoryKey = @key";

            EnumExtension.setUpdateValues(data, "QHistoryKey", ref sql);

            SqlCommand cmd = new SqlCommand(sql, oConn);

            cmd.Parameters.Add("@key", SqlDbType.Int).Value = data.QHistoryKey;

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

            QHistory returnData = Get(data.QHistoryKey, oConn);

            ConnManager.CloseConn(oConn);

            return returnData;
        }

        private QHistory Get(int id, SqlConnection oConn)
        {
            string sql = " SELECT a.* " +
                         " FROM QuoteHistory a " +
                         " WHERE (a.QHistoryKey = @id)";

            SqlDataAdapter da = new SqlDataAdapter(sql, oConn);

            da.SelectCommand.Parameters.Add("@id", SqlDbType.Int).Value = Convert.ToInt32(id);

            DataSet ds = new DataSet();

            da.Fill(ds);

            DataTable dt;
            dt = ds.Tables[0];

            if (dt.Rows.Count > 0)
            {
                IList<QHistory> data = dt.ToList<QHistory>();
                return data.FirstOrDefault<QHistory>();
            }

            return null;
        }

        public bool Remove(QHistory data, ref string msgError)
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
                result = Remove(data, oConn);
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

        private bool Remove(QHistory data, SqlConnection oConn)
        {
            string sql = "DELETE FROM QuoteHistory " +
                         " WHERE (QHistoryKey = @key)";

            sql = String.Format(sql, data.QHistoryKey);

            SqlCommand cmd = new SqlCommand(sql, oConn);

            cmd.Parameters.Add("@key", SqlDbType.Int).Value = data.QHistoryKey;

            int number = Convert.ToInt32(cmd.ExecuteNonQuery());

            if (number > 0) return true;

            return false;
        }

    }
}