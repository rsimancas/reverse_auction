﻿namespace NuvemWA.Models
{
    using NuvemWA.Clases;
    using System;
    using System.Collections.Generic;

    interface IItemsRepository
    {
        Item Get(int id, ref string errMsg);
        Item Add(Item data, ref string errMsg);
        bool Remove(Item data, ref string errMsg);
        Item Update(Item data, ref string errMsg);
        IList<Item> GetList(FieldFilters fieldFilters, string query, Sort sort, Filter filter, String[] queryBy, int page, int start, int limit, ref int totalRecords, ref string errorMsg);
    }
}
