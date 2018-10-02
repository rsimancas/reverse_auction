using System;
using System.Collections.Generic;

namespace NuvemWA.Models
{
    interface ICurrencyRatesRepository
    {
        CurrencyRate Get(int id, ref string errMsg);
        CurrencyRate Add(CurrencyRate data, ref string errMsg);
        bool Remove(CurrencyRate data, ref string errMsg);
        CurrencyRate Update(CurrencyRate data, ref string errMsg);
        IList<CurrencyRate> GetList(string query, Sort sort, int page, int start, int limit, ref int totalRecords, ref string errorMsg);

        Decimal GetRateOfDate(DateTime dateTo, ref string errMsg);

        CurrencyRate GetLastRegisteredRate();
    }
}
