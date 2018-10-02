using Helpers;
using NuvemWA.Clases;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Reflection;
using Utilidades;

namespace NuvemWA.Models
{
    public class CustShipAddressRepository : ICustShipAddressRepository
    {
        public IList<CustomerShipAddress> GetList(FieldFilters fieldFilters, string query, Sort sort, int page, int start, int limit, ref int totalRecords)
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
                string fieldName = "CustShipAddress";
                where += (!string.IsNullOrEmpty(where) ? " and " : "") +
                    EnumExtension.generateLikeWhere(query, fieldName);
            }

            // Handle Order
            string order = "CustShipKey";
            string direction = "ASC";

            if (!string.IsNullOrWhiteSpace(sort.property))
            {
                order = sort.property;
                direction = sort.direction;
            }

            string sql = @"WITH qData 
                            AS
                            ( 
                                SELECT *, ROW_NUMBER() OVER (ORDER BY {2} {3}) as row
                                FROM vCustShipAddress
                                WHERE {0}
                            )
                            SELECT {4} a.*, t5.TotalRecords
                            FROM qData a
                                CROSS APPLY (select MAX(row) as TotalRecords from qData) as t5
                            WHERE {1}  
                            ORDER BY row ";

            where = (where.StartsWith("1=1 AND ")) ? where.Replace("1=1 AND ", "") : where;
            string topLimit = ((@limit > 0) ? String.Format(" TOP {0} ", @limit) : "");
            sql = String.Format(sql, where, wherepage, order, direction, topLimit);

            SqlDataAdapter da = new SqlDataAdapter(sql, oConn);

            DataSet ds = new DataSet();

            try
            {
                da.Fill(ds);
            }
            catch (Exception ex)
            {
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                LogManager.Write(sql);
                throw;
            }

            ConnManager.CloseConn(oConn);

            DataTable dt;
            dt = ds.Tables[0];

            totalRecords = dt.Rows.Count;

            if (totalRecords > 0)
            {

                IList<CustomerShipAddress> data = dt.ToList<CustomerShipAddress>();
                totalRecords = Convert.ToInt32(dt.Rows[0]["TotalRecords"]);
                return data;
            }
            else
            {
                return null;
            }
        }

        public CustomerShipAddress Get(int id)
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

            CustomerShipAddress data = Get(id, oConn);

            ConnManager.CloseConn(oConn);

            return data;
        }

        public CustomerShipAddress Add(CustomerShipAddress data)
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

            string sql = "INSERT INTO CustShipAddress ({0}) VALUES ({1}) " +
                "SELECT SCOPE_IDENTITY()";

            EnumExtension.setListValues(data, "CustShipKey", ref sql);

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

            CustomerShipAddress returnData = Get(keyGenerated, oConn);

            ConnManager.CloseConn(oConn);

            return returnData;
        }

        public CustomerShipAddress Update(CustomerShipAddress data)
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

            string sql = "UPDATE CustShipAddress SET {0} WHERE CustShipKey = @key";

            EnumExtension.setUpdateValues(data, "CustShipKey", ref sql);

            SqlCommand cmd = new SqlCommand(sql, oConn);

            cmd.Parameters.Add("@key", SqlDbType.Int).Value = data.CustShipKey;

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

            CustomerShipAddress returnData = Get(data.CustShipKey, oConn);

            ConnManager.CloseConn(oConn);

            return returnData;
        }

        private CustomerShipAddress Get(int id, SqlConnection oConn)
        {
            string sql = " SELECT * FROM vCustShipAddress WHERE (CustShipKey = @id)";

            SqlDataAdapter da = new SqlDataAdapter(sql, oConn);

            da.SelectCommand.Parameters.Add("@id", SqlDbType.Int).Value = Convert.ToInt32(id);

            DataSet ds = new DataSet();

            da.Fill(ds);

            DataTable dt;
            dt = ds.Tables[0];

            if (dt.Rows.Count > 0)
            {
                IList<CustomerShipAddress> data = dt.ToList<CustomerShipAddress>();
                return data.FirstOrDefault<CustomerShipAddress>();
            }

            return null;
        }

        public bool Remove(CustomerShipAddress data)
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
                result = Remove(data, oConn);
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

        private bool Remove(CustomerShipAddress data, SqlConnection oConn)
        {
            string sql = "DELETE FROM CustShipAddress " +
                         " WHERE (CustShipKey = @key)";

            sql = String.Format(sql, data.CustShipKey);

            SqlCommand cmd = new SqlCommand(sql, oConn);

            cmd.Parameters.Add("@key", SqlDbType.Int).Value = data.CustShipKey;

            int number = Convert.ToInt32(cmd.ExecuteNonQuery());

            if (number > 0) return true;

            return false;
        }

    }
}