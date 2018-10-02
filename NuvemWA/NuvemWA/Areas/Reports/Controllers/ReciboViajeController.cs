﻿using NuvemWA.Models;
using Microsoft.Reporting.WebForms;
using System;
using System.Collections.Specialized;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Web.Mvc;
using Utilidades;
using System.Reflection;

namespace NuvemWA.Areas.Reports.Controllers
{
    public class ReciboViajeController : Controller
    {
        static readonly IUsersRepository userRepository = new UsersRepository();
        static NameValueCollection queryValues = null;
        static User currentUser = null;

        //
        // GET: /Reports/QuoteCustomer/
        public ActionResult Index()
        {

            //dynamic objPB = Activator.CreateInstance(Type.GetTypeFromProgID("XStandard.MD5"));
            //string key = "que clave tan hija de puta ?";
            //LogManager.Write(Utils.GetMd5Hash(key));
            //Utils.ReadDBFUsingOdbc();
            if (!CheckToken(Request.Headers))
            {
                //LogManager.Write("ERROR TOKEN");
                return RedirectToAction("Error");
            }
            //return RedirectToAction("GetPDF");

            queryValues = Request.QueryString;
            int id = Convert.ToInt32(queryValues["id"]);

            DataTable dtHeader = GetData(id);
            //DataTable dtDetails = GetDetail(id);
            LocalReport lr = new LocalReport();

            lr.DataSources.Clear();
            lr.DataSources.Add(new ReportDataSource("dsDistribucion", dtHeader));
            //lr.DataSources.Add(new ReportDataSource("dsReciboViajeItemDetail", dtDetails));

            lr.ReportPath = "bin/Areas/Reports/ReportDesign/ReciboViaje.rdlc";

            //lr.SubreportProcessing += new SubreportProcessingEventHandler(lr_SubreportProcessing);

            string reportType = "PDF";
            string mimeType;
            string encoding;
            string fileNameExtension;

            //ReportPageSettings rps = lr.GetDefaultPageSettings();

            string deviceInfo =
            "<DeviceInfo>" +
            "  <OutputFormat>" + id + "</OutputFormat>" +
            "  <PageWidth>8.5in</PageWidth>" +
            "  <PageHeight>11in</PageHeight>" +
            "  <MarginTop>0.2in</MarginTop>" +
            "  <MarginLeft>0.2in</MarginLeft>" +
            "  <MarginRight>0.2in</MarginRight>" +
            "  <MarginBottom>0.2in</MarginBottom>" +
            "</DeviceInfo>";

            Warning[] warnings;
            string[] streams;
            byte[] bytes;

            bytes = lr.Render(
                reportType,
                deviceInfo,
                out mimeType,
                out encoding,
                out fileNameExtension,
                out streams,
                out warnings);

            string fileName = Utils.GetTempFileNameWithExt("pdf");
            FileStream fs = new FileStream(fileName, FileMode.OpenOrCreate);
            fs.Write(bytes, 0, bytes.Length);
            fs.Close();


            return Content(Path.GetFileNameWithoutExtension(fileName));
        }

        public ActionResult Error()
        {
            return View();
        }

        public ActionResult GetPDF()
        {
            //Response.StatusCode = 400;
            //Response.End();
            int id = Convert.ToInt32(queryValues["id"]);

            DataTable dt = GetData(id);
            DataTable dtDetail = GetDetail(id);
            LocalReport lr = new LocalReport();

            lr.DataSources.Clear();
            lr.DataSources.Add(new ReportDataSource("dsReciboViaje", dt));
            lr.DataSources.Add(new ReportDataSource("dsFileReciboViajeItemDetail", dtDetail));

            lr.ReportPath = "bin/Areas/Reports/ReportDesign/ReciboViaje.rdlc";

            //lr.SubreportProcessing += new SubreportProcessingEventHandler(lr_SubreportProcessing);

            string reportType = "PDF";
            string mimeType;
            string encoding;
            string fileNameExtension;

            //ReportPageSettings rps = lr.GetDefaultPageSettings();

            string deviceInfo =
            "<DeviceInfo>" +
            "  <OutputFormat>" + id + "</OutputFormat>" +
            "  <PageWidth>8.5in</PageWidth>" +
            "  <PageHeight>11in</PageHeight>" +
            "  <MarginTop>0.2in</MarginTop>" +
            "  <MarginLeft>0.2in</MarginLeft>" +
            "  <MarginRight>0.2in</MarginRight>" +
            "  <MarginBottom>0.2in</MarginBottom>" +
            "</DeviceInfo>";

            Warning[] warnings;
            string[] streams;
            byte[] renderedBytes;

            renderedBytes = lr.Render(
                reportType,
                deviceInfo,
                out mimeType,
                out encoding,
                out fileNameExtension,
                out streams,
                out warnings);

            //Response.ContentType = "application/pdf";
            //Response.AddHeader("content-length", renderedBytes.Length.ToString());
            //Response.AddHeader("Content-Disposition:attachment", "inline;");
            //Response.AddHeader("Cache-Control", "private, max-age=0, must-revalidate");
            //Response.AddHeader("Pragma", "public");
            //Response.BinaryWrite(renderedBytes);

            //Response.Clear();
            //Response.ContentType = "application/pdf";
            //Response.BinaryWrite(renderedBytes);
            //Response.Flush();
            //Response.End();

            return File(renderedBytes, mimeType);

            //return renderedBytes;

            //return View();
        }

        void lr_SubreportProcessing(object sender, SubreportProcessingEventArgs e)
        {
            int id = Convert.ToInt32(queryValues["id"]);
            DataTable dt = GetChargesDetail(id);
            //DataTable dtSub = GetChargesSubDetail(id);
            e.DataSources.Add(new ReportDataSource("dsReciboViajeChargeDetail", dt));
            //e.DataSources.Add(new ReportDataSource("dsReciboViajeChargeSubDetails", dtSub));
        }

        private DataTable GetData(int id)
        {
            DataTable dt = new DataTable();
            using (SqlConnection oConn = ConnManager.OpenConn())
            {
                string sql = "SELECT * from dbo.fn_GetDatosRecibo({0})";
                sql = String.Format(sql, id);
                SqlCommand cmd = new SqlCommand(sql, oConn);
                SqlDataAdapter adp = new SqlDataAdapter(cmd);
                adp.Fill(dt);
            }
            return dt;
        }

        private DataTable GetDetail(int id)
        {
            DataTable dt = new DataTable();
            using (SqlConnection oConn = ConnManager.OpenConn())
            {
                string sql = "SELECT *, " +
                             "(CASE WHEN SBLanguageKey IS NULL THEN '' ELSE " +
                             "(SELECT        CAST(text AS NVARCHAR(4000)) + ' ' + SBLanguageSchBNum " +
                             "  FROM            tsysReportText " +
                             "  WHERE        TextKey = 24 AND TextLanguageCode = CustLanguageCode) END) AS LineReportText " +
                             "FROM qrptFileQuoteCustomerItemDetail " +
                             " INNER JOIN qrptQuoteCustomer ON FVQHdrKey=QHdrKey " +
                             "WHERE FVQHdrKey = {0}";
                sql = String.Format(sql, id);
                SqlCommand cmd = new SqlCommand(sql, oConn);
                SqlDataAdapter adp = new SqlDataAdapter(cmd);
                adp.Fill(dt);
            }

            return dt;
        }

        private DataTable GetChargesDetail(int id)
        {
            DataTable dt = new DataTable();
            using (SqlConnection oConn = ConnManager.OpenConn())
            {
                string sql = "WITH qCharges (QChargeFileKey, QChargeHdrKey, QChargeSort, QChargeMemo, QChargeCost, " +
                             "               QChargePrice, QCDLanguageCode, QCDDescription, SubTotalCategory) " +
                             "AS " +
                             "( " +
                             "	SELECT a.QChargeFileKey, a.QChargeHdrKey, a.QChargeSort,a.QChargeMemo,   " +
                             "	a.QChargeCost * a.QChargeCurrencyRate / b.QHdrCurrencyRate AS QChargeCost,  " +
                             "	a.QChargePrice * a.QChargeCurrencyRate / b.QHdrCurrencyRate AS QChargePrice,  " +
                             "	d.DescriptionLanguageCode AS QCDLanguageCode,   " +
                             "	d.DescriptionText AS QCDDescription,   " +
                             "	(CASE WHEN c.ChargeSubTotalCategory=3 Then 8 Else c.ChargeSubTotalCategory End) AS SubTotalCategory  " +
                             "	FROM tblFileQuoteCharges a   " +
                             "	 INNER JOIN tblFileQuoteHeader b ON a.QChargeHdrKey = b.QHdrKey   " +
                             "	 INNER JOIN tlkpChargeCategories c ON a.QChargeChargeKey = c.ChargeKey  " +
                             "	 INNER JOIN tlkpChargeCategoryDescriptions d ON a.QChargeChargeKey = d.DescriptionChargeKey  " +
                             "	 INNER JOIN qrptQuoteCustomer e ON a.QChargeHdrKey=e.QHdrKey and d.DescriptionLanguageCode=e.CustLanguageCode  " +
                             "	 WHERE a.QChargeHdrKey={0} and (a.QChargePrint = 1)  " +
                             ")  " +
                             "SELECT b.SubTotalKey AS SubTotalKey, b.SubTotalSort AS SubTotalSort,  " +
                             "       a.STDescriptionLanguageCode AS SubTotalLanguageCode,   " +
                             "       a.STDescriptionText AS SubTotalDescription,  " +
                             "       e.Location AS SubTotalLocation, d.QHdrKey AS ShowFooter, c.QHdrKey, " +
                             "       f.*  " +
                             "FROM tlkpInvoiceSubTotalCategoriesDescriptions a   " +
                             "	INNER JOIN tlkpInvoiceSubTotalCategories b ON a.STDescriptionSubTotalKey = b.SubTotalKey  " +
                             "	INNER JOIN qrptQuoteCustomer c ON c.QHdrKey = {0} and a.STDescriptionLanguageCode = c.CustLanguageCode  " +
                             "  INNER JOIN qrptFileQuoteCustomerChargeDetailLocations d ON d.QHdrKey=c.QHdrKey and d.SubTotalKey=b.SubTotalKey  " +
                             "  INNER JOIN qrptFileQuoteCustomerChargeDetailLocations e ON e.QHdrKey=c.QHdrKey and e.SubTotalKey=b.SubTotalKey " +
                             "  LEFT JOIN qCharges f ON f.SubTotalCategory=b.SubTotalKey " +
                             "ORDER BY b.SubTotalSort";

                sql = "dbo.spGetChargesDetails {0}";
                sql = String.Format(sql, id);

                SqlCommand cmd = new SqlCommand(sql, oConn);
                SqlDataAdapter adp = new SqlDataAdapter(cmd);
                adp.Fill(dt);
            }

            return dt;
        }

        private DataTable GetChargesDetailBackup(int id)
        {
            DataTable dt = new DataTable();
            using (SqlConnection oConn = ConnManager.OpenConn())
            {
                string sql = "SELECT b.SubTotalKey AS SubTotalKey, b.SubTotalSort AS SubTotalSort, " +
                             "       a.STDescriptionLanguageCode AS SubTotalLanguageCode,  " +
                             "       a.STDescriptionText AS SubTotalDescription, " +
                             "       e.Location AS SubTotalLocation, d.QHdrKey AS ShowFooter, c.QHdrKey " +
                             "FROM tlkpInvoiceSubTotalCategoriesDescriptions a  " +
                             "	INNER JOIN tlkpInvoiceSubTotalCategories b ON a.STDescriptionSubTotalKey = b.SubTotalKey " +
                             "	INNER JOIN qrptQuoteCustomer c ON c.QHdrKey = {0} and a.STDescriptionLanguageCode = c.CustLanguageCode " +
                             "  INNER JOIN qrptFileQuoteCustomerChargeDetailLocations d ON d.QHdrKey=c.QHdrKey and d.SubTotalKey=b.SubTotalKey " +
                             "  INNER JOIN qrptFileQuoteCustomerChargeDetailLocations e ON e.QHdrKey=c.QHdrKey and e.SubTotalKey=b.SubTotalKey " +
                             "ORDER BY b.SubTotalSort";
                sql = String.Format(sql, id);
                SqlCommand cmd = new SqlCommand(sql, oConn);
                SqlDataAdapter adp = new SqlDataAdapter(cmd);
                adp.Fill(dt);
            }

            return dt;
        }

        private DataTable GetChargesSubDetail(int id)
        {
            DataTable dt = new DataTable();
            using (SqlConnection oConn = ConnManager.OpenConn())
            {
                string sql = "SELECT a.QChargeFileKey, a.QChargeHdrKey, a.QChargeSort, " +
                             "a.QChargeMemo,  " +
                             "a.QChargeCost * a.QChargeCurrencyRate / b.QHdrCurrencyRate AS QChargeCost, " +
                             " a.QChargePrice * a.QChargeCurrencyRate / b.QHdrCurrencyRate AS QChargePrice, " +
                             " d.DescriptionLanguageCode AS QCDLanguageCode,  " +
                             "d.DescriptionText AS QCDDescription,  " +
                             "c.ChargeSubTotalCategory AS SubTotalCategory " +
                             "FROM tblFileQuoteCharges a  " +
                             " INNER JOIN tblFileQuoteHeader b ON a.QChargeHdrKey = b.QHdrKey  " +
                             " INNER JOIN tlkpChargeCategories c ON a.QChargeChargeKey = c.ChargeKey " +
                             " INNER JOIN tlkpChargeCategoryDescriptions d ON a.QChargeChargeKey = d.DescriptionChargeKey " +
                             " INNER JOIN qrptQuoteCustomer e ON a.QChargeHdrKey=e.QHdrKey and d.DescriptionLanguageCode=e.CustLanguageCode " +
                             " WHERE a.QChargeHdrKey={0} and (a.QChargePrint = 1) " +
                             " ORDER BY a.QChargeFileKey, a.QChargeHdrKey, a.QChargeSort,a.QChargeKey";
                sql = String.Format(sql, id);
                SqlCommand cmd = new SqlCommand(sql, oConn);
                SqlDataAdapter adp = new SqlDataAdapter(cmd);
                adp.Fill(dt);
            }

            return dt;
        }

        private bool CheckToken(NameValueCollection headers)
        {
            string token;

            try
            {
                token = headers.GetValues("Authorization-Token").First();
            }
            catch (Exception)
            {
                return false;
            }

            try
            {
                string[] split = token.Split(',');

                string usrName = Utils.Decrypt(split[0]);
                string usrPwd = Utils.Decrypt(split[1]);

                var userLogged = userRepository.ValidLogon(usrName, usrPwd);

                if (userLogged == null)
                {
                    return false;
                };

                currentUser = userLogged;
            }
            catch (Exception ex)
            {
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                return false;
            }

            return true;
        }

    }
}

