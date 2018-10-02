namespace NuvemWA.Models
{
    using Helpers;
    using NuvemWA.Clases;
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Data.SqlClient;
    using System.Linq;
    using System.Net;
    using System.Net.Mail;
    using System.Reflection;
    using System.Web;
    using Utilidades;

    public class UsersRepository : IUsersRepository
    {
        private static ICustomersRepository custRepository = new CustomersRepository();
        private static IVendorsRepository vendorRepository = new VendorsRepository();
        private static IUserRolesRepository uroleRepository = new UserRolesRepository();

        public IList<User> GetList(FieldFilters fieldFilters, string query, Sort sort, int page, int start, int limit, ref int totalRecords)
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
                string fieldName = "UserName";
                where += (!string.IsNullOrEmpty(where) ? " and " : "") +
                    EnumExtension.generateLikeWhere(query, fieldName);
            }

            // Handle Order
            string order = "UserName";
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
                                FROM vUsers
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
                throw;
            }

            ConnManager.CloseConn(oConn);

            DataTable dt;
            dt = ds.Tables[0];

            totalRecords = dt.Rows.Count;

            if (totalRecords > 0)
            {

                IList<User> data = dt.ToList<User>().Select(c => { c.UserPassword = Utils.Decrypt(c.UserPassword); return c; }).ToList();
                totalRecords = Convert.ToInt32(dt.Rows[0]["TotalRecords"]);

                return data;
            }
            else
            {
                return null;
            }
        }

        public User Get(int id)
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

            User data = Get(id, oConn);

            ConnManager.CloseConn(oConn);

            return data;
        }

        public User Add(User data)
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

            string sql = "INSERT INTO Users ({0}) VALUES ({1}) " +
                "SELECT SCOPE_IDENTITY()";

            data.UserPassword = Utils.Encrypt(data.UserPassword);

            EnumExtension.setListValues(data, "UserKey", ref sql);

            SqlCommand cmd = new SqlCommand(sql, oConn);

            int keyGenerated = 0;

            try
            {
                keyGenerated = Convert.ToInt32(cmd.ExecuteScalar());
            }
            catch (Exception ex)
            {
                ConnManager.CloseConn(oConn);

                while (ex != null)
                {
                    LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                    ex = ex.InnerException;
                }

                throw;
            }

            User returnData = Get(keyGenerated, oConn);

            ConnManager.CloseConn(oConn);

            return returnData;
        }

        public User Update(User data)
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

            string sql = "UPDATE Users SET {0} WHERE UserKey = @key";

            data.UserPassword = Utils.Encrypt(data.UserPassword);
            EnumExtension.setUpdateValues(data, "UserKey", ref sql);

            SqlCommand cmd = new SqlCommand(sql, oConn);

            cmd.Parameters.Add("@key", SqlDbType.Int).Value = data.UserKey;

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

            User returnData = Get(data.UserKey, oConn);

            ConnManager.CloseConn(oConn);

            return returnData;
        }

        private User Get(int id, SqlConnection oConn)
        {
            string sql = "SELECT * FROM vUsers WHERE (UserKey = @id)";

            SqlDataAdapter da = new SqlDataAdapter(sql, oConn);

            da.SelectCommand.Parameters.Add("@id", SqlDbType.Int).Value = Convert.ToInt32(id);

            DataSet ds = new DataSet();

            da.Fill(ds);

            DataTable dt;
            dt = ds.Tables[0];

            if (dt.Rows.Count > 0)
            {
                IList<User> data = dt.ToList<User>();
                var usr = data.FirstOrDefault<User>();

                usr.UserPassword = Utils.Decrypt(usr.UserPassword);

                return usr;
            }

            return null;
        }

        public bool Remove(User data)
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

        private bool Remove(User data, SqlConnection oConn)
        {
            string sql = "DELETE FROM Users WHERE (UserKey = @key)";

            SqlCommand cmd = new SqlCommand(sql, oConn);
            cmd.Parameters.Add("@key", SqlDbType.Int).Value = data.UserKey;

            int number = Convert.ToInt32(cmd.ExecuteNonQuery());

            if (number > 0) return true;

            return false;
        }

        public User ValidLogon(string userEmail, string userPassword)
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
            
            string sql = @"SELECT *, dbo.fn_GetRoleNameByUserKey(UserKey) as RoleName
                           FROM Users
                           WHERE UserEmail=@uid and UserPassword=@pwd and UserConfirmed = 1";

            SqlDataAdapter da = new SqlDataAdapter(sql, oConn);

            da.SelectCommand.Parameters.Add("@uid", SqlDbType.NVarChar).Value = userEmail;
            da.SelectCommand.Parameters.Add("@pwd", SqlDbType.NVarChar).Value = Utils.Encrypt(userPassword);

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

            var data = dt.ToList<User>();
            
            if (data.Count != 0)
                return data.FirstOrDefault<User>();

            return null;
        }

        public User ValidTokenLogon(string userName, string userPassword)
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


            string sql = @"SELECT *, dbo.fn_GetRoleNameByUserKey(UserKey) as RoleName
                           FROM Users
                           WHERE UserEmail=@uid and UserPassword=@pwd and UserConfirmed = 1";

            SqlDataAdapter da = new SqlDataAdapter(sql, oConn);

            da.SelectCommand.Parameters.Add("@uid", SqlDbType.NVarChar).Value = userName;
            da.SelectCommand.Parameters.Add("@pwd", SqlDbType.NVarChar).Value = Utils.Encrypt(userPassword);

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
            finally
            {
                ConnManager.CloseConn(oConn);
            }

            DataTable dt;
            dt = ds.Tables[0];

            IList<User> data = dt.ToList<User>();

            if (data.Count != 0)
                return data.FirstOrDefault<User>();

            return null;
        }

        public User GetUserForActivation(string userName, string userPassword)
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


            string sql = @"SELECT *, dbo.fn_GetRoleNameByUserKey(UserKey) as RoleName
                           FROM Users
                           WHERE UserEmail=@uid and UserPassword=@pwd";

            SqlDataAdapter da = new SqlDataAdapter(sql, oConn);

            da.SelectCommand.Parameters.Add("@uid", SqlDbType.NVarChar).Value = userName;
            da.SelectCommand.Parameters.Add("@pwd", SqlDbType.NVarChar).Value = Utils.Encrypt(userPassword);

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
            finally
            {
                ConnManager.CloseConn(oConn);
            }

            DataTable dt;
            dt = ds.Tables[0];

            var data = dt.ToList<User>();

            if (data.Count != 0)
                return data.FirstOrDefault<User>();

            return null;
        }

        public string GenToken(string userEmail, string userPassword)
        {

            string id = Utils.Encrypt(userEmail),
                password = Utils.Encrypt(userPassword);

            return String.Format("{0},{1}", id, password);
        }

        public bool CheckIfExists(string userEmail)
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


            string sql = @"SELECT COUNT(*)
                           FROM Users
                           WHERE UserEmail=@uid";

            SqlCommand cmd = new SqlCommand(sql, oConn);

            cmd.Parameters.Add("@uid", SqlDbType.NVarChar).Value = userEmail;

            int result = -1;
            try
            {
                result = Convert.ToInt32(cmd.ExecuteScalar());
            }
            catch (Exception ex)
            {
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                throw;
            }
            finally
            {
                ConnManager.CloseConn(oConn);
            }

            if (result > 0) return true;

            return false;
        }

        public bool CreateUser(UserSignup data, ref string message)
        {
            User usr = new User();
            usr.UserName = data.UserName;
            usr.UserEmail = data.UserEmail;
            usr.UserPassword = data.UserPassword;
            usr.UserConfirmed = false;
            usr.UserCreatedDate = DateTime.Now;

            if (data.registerMode == "purchaser")
            {
                usr.CustKey = CreateCust(usr);
            }
            else
            {
                usr.VendorKey = CreateVendor(usr);
            }

            usr = Add(usr);

            if (usr != null)
            {
                try
                {
                    SendMailActivation(data.UserEmail, data.UserPassword);
                }
                catch (Exception ex)
                {
                    message = "Error Email Service: " + ex.Message;
                    ReverseRegister(usr);
                    return false;
                }
            }

            CreateUserRole(usr, data);

            return true;
        }

        private int CreateCust(User usr)
        {
            Customer cust = new Customer();
            cust.CustName = usr.UserName;
            cust.CustEmail = usr.UserEmail;
            cust.CustCreatedByUserKey = 1;
            cust.CustCreatedDate = DateTime.Now;
            string message = "";
            cust = custRepository.Add(cust, ref message);

            return cust.CustKey;
        }

        private int CreateVendor(User usr)
        {
            Vendor vendor = new Vendor();
            vendor.VendorCreatedByUserKey = 1;
            vendor.VendorEmail = usr.UserEmail;
            vendor.VendorName = usr.UserName;
            vendor.VendorCreatedDate = DateTime.Now;
            vendor = vendorRepository.Add(vendor);
            return vendor.VendorKey;
        }

        private void SendMailActivation(string userEmail, string userPassword)
        {
            try
            {
                NuvemMailMessage msg = new NuvemMailMessage();
                List<string> Emails = new List<string>(); 

                string subject = "Nuvem B2B";

                Emails.Add(userEmail);
                string from = "Nuvem Activation Services";

                /* Si deseamos Adjuntar algún archivo*/
                //mnsj.Attachments.Add(new Attachment(pdfFile));
                string msj = "";

                using (WebClient client = new WebClient())
                {
                    var protocol = HttpContext.Current.Request.IsSecureConnection ? "https:" : "http:";
                    var host =  HttpContext.Current.Request.Url.Host;
                    var path = HttpContext.Current.Request.Url.AbsolutePath;
                    path = host + @"/" + path.Substring(0, path.IndexOf(@"api/")) + @"/EmailActivation";
                    path = path.Replace(@"//", @"/");
                    path = protocol + @"//" + path;

                    msj = client.DownloadString(path + "?token=" + Uri.EscapeDataString(GenToken(userEmail, userPassword)));
                }

                
                /* Enviar */
                MailHelper.SendToEnqueue(subject, Emails, msj, from);

                //System.IO.File.Delete(pdfFile);
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

        private void CreateUserRole(User usr, UserSignup reg)
        {
            UserRole urole = new UserRole();
            urole.UserKey = usr.UserKey;
            urole.RoleKey = reg.registerMode == "purchaser" ? 2 : 3;
            urole.URoleCreatedDate = DateTime.Now;
            string message = "";
            urole = uroleRepository.Add(urole, ref message);
        }

        private void ReverseRegister(User usr)
        {
            string err = "";
            if (usr.CustKey != null)
            {
                Customer cust = custRepository.Get(usr.CustKey.GetValueOrDefault(), ref err);
                bool removed = custRepository.Remove(cust, ref err);
            }
            if (usr.VendorKey != null)
            {
                bool removed = vendorRepository.Remove(usr.VendorKey.GetValueOrDefault(), ref err);
            }

            //Remove(usr, ref err);
        }

        public bool ActivateUser(string userEmail, string userPassword)
        {
            SqlConnection oConn;

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

                return false;
            }

            try
            {
                var usr = GetUserForActivation(userEmail, userPassword);

                if (usr == null) return false;

                string sql = "UPDATE Users set UserConfirmed = 1 Where UserKey = @key";

                SqlCommand cmd = new SqlCommand(sql, oConn);
                cmd.Parameters.Add("@key", SqlDbType.Int).Value = usr.UserKey;

                cmd.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                while (ex != null)
                {
                    LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                    ex = ex.InnerException;
                }
                return false;
            }
            finally
            {
                ConnManager.CloseConn(oConn);
            }

            return true;
        }

        public void FirstLogonOff(int UserKey)
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

            string sql = "UPDATE Users SET UserFirstLogon = CAST(0 AS BIT) WHERE UserKey = @key";

            SqlCommand cmd = new SqlCommand(sql, oConn);

            cmd.Parameters.Add("@key", SqlDbType.Int).Value = UserKey;

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

            ConnManager.CloseConn(oConn);
        }
    }
}