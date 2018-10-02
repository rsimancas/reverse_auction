using System;
using System.Collections.Generic;

namespace NuvemWA.Models
{
    interface ICurrenciesRepository
    {
        Currency Get(string id, ref string errMsg);
        Currency Add(Currency data, ref string errMsg);
        bool Remove(Currency data, ref string errMsg);
        Currency Update(Currency data, ref string errMsg);
        IList<Currency> GetList(string query, Sort sort, int page, int start, int limit, ref int totalRecords, ref string errorMsg);
        Decimal GetRateOfDate(DateTime dateTo, ref string errMsg);
        Currency GetLastRegisteredRate();
    }
}
