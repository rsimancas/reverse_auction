﻿using NuvemWA.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Reflection;
using System.Web.Http;
using Utilidades;
using NuvemWA.Clases;

namespace NuvemWA.Controllers
{

    [TokenValidation]
    public class CategoriesController : ApiController
    {
        static readonly ICategoriesRepository repository = new CategoriesRepository();

        public object GetAll()
        {
            var queryValues = Request.RequestUri.ParseQueryString();

            int page = Convert.ToInt32(queryValues["page"]);
            int start = Convert.ToInt32(queryValues["start"]);
            int limit = Convert.ToInt32(queryValues["limit"]);
            int id = Convert.ToInt32(queryValues["id"]);
            int orden = Convert.ToInt32(queryValues["orden"]);

            string strFieldFilters = queryValues["fieldFilters"];

            FieldFilters fieldFilters = new FieldFilters();

            if (!String.IsNullOrEmpty(strFieldFilters))
            {
                fieldFilters = JsonConvert.DeserializeObject<FieldFilters>(strFieldFilters);
            }


            #region Configuramos el orden de la consulta si se obtuvo como parametro
            string strOrder = !string.IsNullOrWhiteSpace(queryValues["sort"]) ? queryValues["sort"] : "";
            strOrder = strOrder.Replace('[', ' ');
            strOrder = strOrder.Replace(']', ' ');

            Sort sort;

            if (!string.IsNullOrWhiteSpace(strOrder))
            {
                sort = JsonConvert.DeserializeObject<Sort>(strOrder);
            }
            else
            {
                sort = new Sort();
            }
            #endregion

            string query = !string.IsNullOrWhiteSpace(queryValues["query"]) ? queryValues["query"] : "";

            int totalRecords = 0;

            try
            {
                if (id == 0)
                {
                    object json;
                    IList<Category> lista;

                    lista = repository.GetList(fieldFilters, query, sort, page, start, limit, ref totalRecords);

                    json = new
                    {
                        total = totalRecords,
                        data = lista,
                        success = true
                    };

                    return json;
                }
                else
                {
                    Category estatus = repository.Get(id);

                    object json = new
                    {
                        data = estatus,
                        success = true
                    };

                    return json;
                }
            }
            catch (Exception ex)
            {
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);

                object json = new
                {
                    message = ex.Message,
                    success = false
                };

                return json;
            }
        }

        public object Post(Category added)
        {
            object json;

            try
            {
                Category posted = repository.Add(added);

                json = new
                {
                    total = 1,
                    data = posted,
                    success = true
                };

            }
            catch (Exception ex)
            {
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);

                json = new
                {
                    message = ex.Message,
                    success = false
                };
            };

            return json;
        }

        public object Put(Category updated)
        {
            object json;

            try
            {
                Category putting = repository.Update(updated);

                json = new
                {
                    total = 1,
                    data = putting,
                    success = true
                };
            }
            catch (Exception ex)
            {
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                json = new
                {
                    message = ex.Message,
                    success = false
                };
            };

            return json;
        }

        public object Delete(Category deleted)
        {
            object json;

            try
            {
                bool result = repository.Remove(deleted);
                json = new
                {
                    success = result
                };
            }
            catch (Exception ex)
            {
                json = new
                {
                    success = false,
                    message = ex.Message
                };

            }

            return json;
        }
    }
}