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
    public class CurrenciesRepository : ICurrenciesRepository
    {
        public IList<Currency> GetList(string query, Sort sort, int page, int start, int limit, ref int totalRecords, ref string errMsg)
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
                string fieldName = "a.CurrencyCode";
                where += (!string.IsNullOrEmpty(where) ? " and " : "") +
                    EnumExtension.generateLikeWhere(query, fieldName);
            }

            // Handle Order
            string order = "a.CurrencyDate";
            string direction = "DESC";

            if (!string.IsNullOrWhiteSpace(sort.property))
            {
                order = sort.property;
                direction = sort.direction;
            }

            string sql = "SELECT * FROM ( " +
                         "SELECT a.*, " +
                         "  ROW_NUMBER() OVER (ORDER BY {2} {3}) as row,  " +
                         "  IsNull((select count(*) from Currencies a WHERE {0}),0)  as TotalRecords   " +
                         " FROM Currencies a WHERE {0}) a  " +
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

                IList<Currency> data = dt.ToList<Currency>();
                totalRecords = Convert.ToInt32(dt.Rows[0]["TotalRecords"]);
                return data;
            }
            else
            {
                return null;
            }
        }

        public Currency Get(string id, ref string msgError)
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

            Currency data = Get(id, oConn);

            ConnManager.CloseConn(oConn);

            return data;
        }

        private Currency Get(string id, SqlConnection oConn)
        {
            string sql = "SELECT a.* FROM Currencies a " +
                         " WHERE (a.CurrencyCode = @id)";

            SqlDataAdapter da = new SqlDataAdapter(sql, oConn);

            da.SelectCommand.Parameters.Add("@id", SqlDbType.NChar).Value = id;

            DataSet ds = new DataSet();

            da.Fill(ds);

            DataTable dt;
            dt = ds.Tables[0];

            if (dt.Rows.Count > 0)
            {
                IList<Currency> data = dt.ToList<Currency>();
                return data.FirstOrDefault<Currency>();
            }

            return null;
        }

        public Currency Add(Currency data, ref string msgError)
        {
            SqlConnection oConn = null;

            try
            {
                oConn = ConnManager.OpenConn();
            }
            catch (Exception ex)
            {
                while (ex != null)
                {
                    LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                    ex = ex.InnerException;
                }

                throw;
            };

            string sql = "INSERT INTO Currencies ({0}) VALUES ({1}) ";

            EnumExtension.setListValues(data, "", ref sql);

            SqlCommand cmd = new SqlCommand(sql, oConn);

            try
            {
                cmd.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                ConnManager.CloseConn(oConn);

                while (ex != null)
                {
                    LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                    ex = ex.InnerException;
                }

                msgError = ex.Message;
                return null;
            }

            Currency returnData = Get(data.CurrencyCode, oConn);

            ConnManager.CloseConn(oConn);

            return returnData;
        }

        public Currency Update(Currency data, ref string msgError)
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

            //data.CurrencyModified = DateTime.Now;
            string sql = String.Format("UPDATE Currencies SET {0} WHERE CurrencyId = '{0}'", data.CurrencyCode);

            EnumExtension.setUpdateValues(data, "CurrencyCode", ref sql);

            SqlCommand cmd = new SqlCommand(sql, oConn);

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

            Currency returnData = Get(data.CurrencyCode, oConn);

            ConnManager.CloseConn(oConn);

            return returnData;
        }

        public bool Remove(Currency data, ref string msgError)
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

        private bool Remove(Currency data, SqlConnection oConn)
        {
            string sql = "DELETE FROM Currencies " +
                         " WHERE (CurrencyId = '{0}')";

            sql = String.Format(sql, data.CurrencyCode);

            SqlCommand cmd = new SqlCommand(sql, oConn);

            int number = Convert.ToInt32(cmd.ExecuteNonQuery());

            if (number > 0) return true;

            return false;
        }

        public Decimal GetRateOfDate(DateTime dateTo, ref string msgError)
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
                return 0;
            };

            Decimal rate = GetRateOfDate(dateTo, oConn);

            ConnManager.CloseConn(oConn);

            return rate;
        }

        private Decimal GetRateOfDate(DateTime dateTo, SqlConnection oConn)
        {
            string sql = "SELECT TOP 1  CurrencyRate " +
                        " FROM Currencies " +
                        " WHERE CAST(CurrencyDate AS DATE) <= CAST(@dateTo AS DATE) " +
                        " ORDER BY CurrencyDate DESC ";

            SqlDataAdapter da = new SqlDataAdapter(sql, oConn);

            da.SelectCommand.Parameters.Add("@dateTo", SqlDbType.DateTime).Value = dateTo;

            DataSet ds = new DataSet();

            da.Fill(ds);

            DataTable dt;
            dt = ds.Tables[0];

            if (dt.Rows.Count > 0)
            {
                Decimal data = (Decimal)dt.Rows[0][0];
                return data;
            }

            return 0;
        }

        public Currency GetLastRegisteredRate()
        {
            SqlConnection oConn = null;

            try
            {
                oConn = ConnManager.OpenConn();
            }
            catch (Exception ex)
            {
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                return null;
            };

            Currency data = GetLastRegisteredRate(oConn);

            ConnManager.CloseConn(oConn);

            return data;
        }

        private Currency GetLastRegisteredRate(SqlConnection oConn)
        {
            string sql = "SELECT TOP 1 a.* FROM Currencies a " +
                         "ORDER BY CurrencyDate DESC";

            SqlDataAdapter da = new SqlDataAdapter(sql, oConn);

            DataSet ds = new DataSet();

            da.Fill(ds);

            DataTable dt;
            dt = ds.Tables[0];

            if (dt.Rows.Count > 0)
            {
                IList<Currency> data = dt.ToList<Currency>();
                return data.FirstOrDefault<Currency>();
            }

            return null;
        }

    }
}