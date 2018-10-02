using Helpers;
using Microsoft.WindowsAPICodePack.Shell;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Data.SqlClient;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Runtime.InteropServices;
using Utilidades;

namespace NuvemWA.Models
{
    public class AttachmentsRepository : IAttachmentsRepository
    {
        public IList<Attached> GetList(bool dirty, int currentUser, ref int totalRecords, ref string errMsg)
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

            string where = (dirty) ? "a.AttachDirty = 1" : "1=1";

            where += String.Format(" AND a.AttachCreatedByUserKey = {0}", currentUser);

            string sql = @"WITH qData
                        AS
                        (
                            SELECT a.*
                            FROM Attachments a
                            WHERE {0}
                        )
                        select *
                        FROM
                        (
	                        SELECT t1.*, t2.TotalRecords,
		                          ROW_NUMBER() OVER (ORDER BY AttachName ASC) as row 
	                        FROM qData t1 INNER JOIN (select count(*) as TotalRecords from qData) as t2 ON 1=1
                        ) a
                        ORDER BY row";

            sql = String.Format(sql, where);

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

                IList<Attached> data = dt.ToList<Attached>();
                totalRecords = Convert.ToInt32(dt.Rows[0]["TotalRecords"]);
                return data;
            }
            else
            {
                return null;
            }
        }

        public Attached Update(IDictionary<String, object> data, int currentUser, ref string msgError)
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
            int userKey = currentUser;
            int id = Convert.ToInt32(data["AttachKey"]);

            string sql = "UPDATE Attachments SET {0} WHERE AttachKey = @id";

            EnumExtension.SetValuesForUpdate(data, "AttachKey", ref sql);

            SqlCommand cmd = new SqlCommand(sql, oConn);

            cmd.Parameters.Add("@id", SqlDbType.Int).Value = id;

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

            Attached returnData = Get(id, oConn);

            ConnManager.CloseConn(oConn);

            return returnData;
        }

        private Attached Get(int Key, SqlConnection oConn)
        {
            string sql = @" SELECT a.*
                            FROM Attachments a
                            WHERE (a.AttachKey = @id)";

            SqlDataAdapter da = new SqlDataAdapter(sql, oConn);

            da.SelectCommand.Parameters.Add("@id", SqlDbType.Int).Value = Convert.ToInt32(Key);

            DataSet ds = new DataSet();

            da.Fill(ds);

            DataTable dt;
            dt = ds.Tables[0];
            if (dt.Rows.Count > 0)
            {
                List<Attached> data = dt.ToList<Attached>();
                return data.FirstOrDefault<Attached>();
            }

            return null;
        }

        public bool Remove(Attached data, ref string msgError)
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

        private bool Remove(Attached data, SqlConnection oConn)
        {
            string sql = "SELECT AttachFilePath FROM Attachments WHERE AttachKey = @id ";

            SqlDataAdapter da = new SqlDataAdapter(sql, oConn);

            da.SelectCommand.Parameters.Add("@id", SqlDbType.Int).Value = data.AttachKey;

            DataSet ds = new DataSet();

            try
            {
                da.Fill(ds);
            }
            catch (Exception ex)
            {
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                return false;
            }

            DataTable dt;
            dt = ds.Tables[0];
            foreach (DataRow row in dt.Rows)
            {
                string file = row[0].ToString();

                File.Delete(file);
            }

            sql = "DELETE FROM Attachments WHERE (AttachKey = @id)";
            SqlCommand cmd = new SqlCommand(sql, oConn);
            cmd.Parameters.Add("@id", SqlDbType.Int).Value = Convert.ToInt32(data.AttachKey);

            int number = Convert.ToInt32(cmd.ExecuteNonQuery());

            if (number > 0) return true;

            return false;
        }

        public bool InsertAttach(string tempFile, int currentUser, bool dirty, string fileName, string contenttype, ref string errMsg)
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

            //insert the file into database
            string strQuery = "insert into Attachments (AttachName, AttachContentType, AttachFilePath, AttachDirty, AttachCreatedByUserKey)" +
               " values (@name, @ContentType, @filepath, @dirty, @user)";

            SqlCommand cmd = new SqlCommand(strQuery, oConn);

            cmd.CommandText = strQuery;
            cmd.Parameters.Add("@dirty", SqlDbType.Bit).Value = dirty;
            cmd.Parameters.Add("@Name", SqlDbType.VarChar).Value = fileName;
            cmd.Parameters.Add("@ContentType", SqlDbType.VarChar).Value = contenttype;
            cmd.Parameters.Add("@filepath", SqlDbType.NVarChar).Value = tempFile;
            cmd.Parameters.Add("@user", SqlDbType.NVarChar).Value = currentUser;

            try
            {
                cmd.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                ConnManager.CloseConn(oConn);
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                errMsg = ex.Message;
                return false;
            }

            ConnManager.CloseConn(oConn);

            return true;
        }

        public string GetFile(int Key, ref string contenttype, ref string errMsg)
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

            string strQuery = String.Format("SELECT AttachFilePath,AttachContentType,AttachName FROM Attachments WHERE AttachKey = {0}", Key);
            SqlCommand cmd = new SqlCommand(strQuery, oConn);

            SqlDataReader dr;
            string filename = "";

            try
            {
                dr = cmd.ExecuteReader();

                while (dr.Read())
                {
                    contenttype = dr["AttachContentType"].ToString();
                    filename = dr["AttachFilePath"].ToString();
                }
            }
            catch (Exception ex)
            {
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                errMsg = ex.Message;
                return null;
            }
            finally
            {
                ConnManager.CloseConn(oConn);
            }

            return filename;
        }

        public string GetThumbFile(int Key, ref string contenttype, ref string errMsg)
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

            string strQuery = String.Format("SELECT AttachFilePath,AttachContentType,AttachName FROM Attachments WHERE AttachKey = {0}", Key);
            SqlCommand cmd = new SqlCommand(strQuery, oConn);

            SqlDataReader dr;
            string filename = "";

            try
            {
                dr = cmd.ExecuteReader();

                while (dr.Read())
                {
                    contenttype = dr["AttachContentType"].ToString();
                    filename = dr["AttachFilePath"].ToString();
                }
            }
            catch (Exception ex)
            {
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                errMsg = ex.Message;
                return null;
            }
            finally
            {
                ConnManager.CloseConn(oConn);
            }

            //Bitmap bmp = ExtractThumbnail(filename, new Size(1024, 1024), SIIGBF.SIIGBF_RESIZETOFIT);

            ShellFile shellFile = ShellFile.FromFilePath(filename);
            //shellFile.Thumbnail.FormatOption = ShellThumbnailFormatOption.ThumbnailOnly;

            //Bitmap bitmap = Image.FromFile(filename);
            Image img = shellFile.Thumbnail.ExtraLargeBitmap;
            //Graphics g = Graphics.FromImage(bitmap);

            //g.Clear(Color.Transparent);
            //g.FillRectangle(Brushes.Black, 100, 100, 100, 100);
            //g.Flush();


            //Image img = bitmap.GetThumbnailImage(100, 120, null, IntPtr.Zero);

            filename = Path.ChangeExtension(filename, "png");
            contenttype = "image/png";
            if (!File.Exists(filename))
                img.Save(filename, ImageFormat.Png);
            //bitmap.Save(filename, System.Drawing.Imaging.ImageFormat.Png);

            return filename;
        }

        private byte[] MakeThumbnail(byte[] myImage, int thumbWidth, int thumbHeight)
        {

            using (MemoryStream ms = new MemoryStream())
            using (Image thumbnail = Image.FromStream(new MemoryStream(myImage)).GetThumbnailImage(thumbWidth, thumbHeight, null, new IntPtr()))
            {
                thumbnail.Save(ms, System.Drawing.Imaging.ImageFormat.Png);
                return ms.ToArray();
            }
        }

        private byte[] GenerateThumbnail(byte[] buffer, int pagenumber = 1)
        {
            string pdf = GetTempPDFFile(buffer);

            try
            {
                string filename = pdf;
                ShellFile shellFile = ShellFile.FromFilePath(filename);
                Bitmap bitmap = shellFile.Thumbnail.ExtraLargeBitmap;
                Image img = bitmap.GetThumbnailImage(100, 150, null, IntPtr.Zero);
                File.Delete(pdf);

                MemoryStream ms = new MemoryStream();
                img.Save(ms, System.Drawing.Imaging.ImageFormat.Jpeg);
                return ms.ToArray();
            }
            catch (Exception ex)
            {
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                return null;
            }
        }

        private string GetTempPDFFile(byte[] buffer)
        {
            Stream stream = new MemoryStream(buffer);

            string fileName = Path.GetTempFileName();

            using (FileStream fs = File.OpenWrite(fileName))
            {
                stream.CopyTo(fs);
            }

            return fileName;
        }

        public static Bitmap ExtractThumbnail(string filePath, Size size, SIIGBF flags)
        {
            if (filePath == null)
                throw new ArgumentNullException("filePath");

            // TODO: you might want to cache the factory for different types of files
            // as this simple call may trigger some heavy-load underground operations
            IShellItemImageFactory factory;
            int hr = SHCreateItemFromParsingName(filePath, IntPtr.Zero, typeof(IShellItemImageFactory).GUID, out factory);
            if (hr != 0)
                throw new Win32Exception(hr);

            IntPtr bmp;
            hr = factory.GetImage(size, flags, out bmp);
            if (hr != 0)
                throw new Win32Exception(hr);

            return Bitmap.FromHbitmap(bmp);
        }

        [Flags]
        public enum SIIGBF
        {
            SIIGBF_RESIZETOFIT = 0x00000000,
            SIIGBF_BIGGERSIZEOK = 0x00000001,
            SIIGBF_MEMORYONLY = 0x00000002,
            SIIGBF_ICONONLY = 0x00000004,
            SIIGBF_THUMBNAILONLY = 0x00000008,
            SIIGBF_INCACHEONLY = 0x00000010,
            SIIGBF_CROPTOSQUARE = 0x00000020,
            SIIGBF_WIDETHUMBNAILS = 0x00000040,
            SIIGBF_ICONBACKGROUND = 0x00000080,
            SIIGBF_SCALEUP = 0x00000100,
        }

        [DllImport("shell32.dll", CharSet = CharSet.Unicode)]
        private static extern int SHCreateItemFromParsingName(string path, IntPtr pbc, [MarshalAs(UnmanagedType.LPStruct)] Guid riid, out IShellItemImageFactory factory);

        [ComImport]
        [InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
        [Guid("bcc18b79-ba16-442f-80c4-8a59c30c463b")]
        private interface IShellItemImageFactory
        {
            [PreserveSig]
            int GetImage(Size size, SIIGBF flags, out IntPtr phbm);
        }
    }
}