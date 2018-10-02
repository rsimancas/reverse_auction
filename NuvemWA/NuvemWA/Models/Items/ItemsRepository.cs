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
    public class ItemsRepository : IItemsRepository
    {
        public IList<Item> GetList(FieldFilters fieldFilters, string query, Sort sort, Filter filter, String[] queryBy, int page, int start, int limit, ref int totalRecords, ref string errMsg)
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

            #region Filtros
            if (!string.IsNullOrWhiteSpace(filter.property))
            {
                where += String.Format(" and a.{0} = {1}", filter.property, filter.value);
            }
            #endregion Filtros

            if (!string.IsNullOrEmpty(query) && queryBy.Length == 0)
            {
                string fieldName = "ItemName+' '+ItemPartNumber";
                where += (!string.IsNullOrEmpty(where) ? " AND " : "") +
                    EnumExtension.generateLikeWhere(query, fieldName);
            }

            #region Query By Settings
            if (!string.IsNullOrEmpty(query) && queryBy.Length > 0)
            {
                string fieldName = "";

                foreach (string field in queryBy)
                {
                    switch (field)
                    {
                        case "ItemName":
                            fieldName += (!String.IsNullOrWhiteSpace(fieldName)) ? " + " : "";
                            fieldName += "ItemName";
                            break;
                        case "ItemPartNumber":
                            fieldName += (!String.IsNullOrWhiteSpace(fieldName)) ? " + " : "";
                            fieldName += "ItemPartNumber";
                            break;
                        default:
                            fieldName += (!String.IsNullOrWhiteSpace(fieldName)) ? " + " : "";
                            fieldName += field;
                            break;
                    }
                }

                where += (!string.IsNullOrEmpty(where) ? " AND " : "") +
                        EnumExtension.generateLikeWhere(query, fieldName);

            }
            #endregion Query By Settings

            // Handle Order
            string order = "ItemName";
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
                                FROM Items
                                WHERE {0}
                            )
                            SELECT {4} *, t5.TotalRecords
                            FROM qData
                            INNER JOIN ((select TOP 1 row as TotalRecords from qData order by row desc)) as t5 on 1=1
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
                errMsg = ex.Message;
                return null;
            }

            ConnManager.CloseConn(oConn);

            DataTable dt;
            dt = ds.Tables[0];

            totalRecords = dt.Rows.Count;

            if (totalRecords > 0)
            {

                IList<Item> data = dt.ToList<Item>();
                totalRecords = Convert.ToInt32(dt.Rows[0]["TotalRecords"]);
                return data;
            }
            else
            {
                return null;
            }
        }

        public Item Get(int id, ref string msgError)
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

            Item data = Get(id, oConn);

            ConnManager.CloseConn(oConn);

            return data;
        }

        public Item Add(Item data, ref string msgError)
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

            data.ItemCreatedDate = DateTime.Now;
            string sql = "INSERT INTO Items ({0}) VALUES ({1}) " +
                "SELECT SCOPE_IDENTITY()";

            EnumExtension.setListValues(data, "ItemKey", ref sql);

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

            Item returnData = Get(keyGenerated, oConn);

            ConnManager.CloseConn(oConn);

            return returnData;
        }

        public Item Update(Item data, ref string msgError)
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

            data.ItemModifiedDate = DateTime.Now;
            string sql = "UPDATE Items SET {0} WHERE ItemKey = @key";

            EnumExtension.setUpdateValues(data, "ItemKey", ref sql);

            SqlCommand cmd = new SqlCommand(sql, oConn);

            cmd.Parameters.Add("@key", SqlDbType.Int).Value = data.ItemKey;

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

            Item returnData = Get(data.ItemKey, oConn);

            ConnManager.CloseConn(oConn);

            return returnData;
        }

        private Item Get(int id, SqlConnection oConn)
        {
            string sql = @"SELECT *
                            FROM Items
                           WHERE (ItemKey = @id)";

            SqlDataAdapter da = new SqlDataAdapter(sql, oConn);

            da.SelectCommand.Parameters.Add("@id", SqlDbType.Int).Value = Convert.ToInt32(id);

            DataSet ds = new DataSet();

            da.Fill(ds);

            DataTable dt;
            dt = ds.Tables[0];

            if (dt.Rows.Count > 0)
            {
                IList<Item> data = dt.ToList<Item>();
                return data.FirstOrDefault<Item>();
            }

            return null;
        }

        public bool Remove(Item data, ref string msgError)
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

        private bool Remove(Item data, SqlConnection oConn)
        {
            string sql = "DELETE FROM Items " +
                         " WHERE (ItemKey = @key)";

            SqlCommand cmd = new SqlCommand(sql, oConn);

            cmd.Parameters.Add("@key", SqlDbType.Int).Value = data.ItemKey;

            int number = Convert.ToInt32(cmd.ExecuteNonQuery());

            if (number > 0) return true;

            return false;
        }

    }
}