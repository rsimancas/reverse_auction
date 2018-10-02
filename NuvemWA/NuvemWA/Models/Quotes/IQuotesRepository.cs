using System;
using System.Collections.Generic;

namespace NuvemWA.Models
{
    interface IQuotesRepository
    {
        QuoteHeader Get(int id, ref string errMsg);
        QuoteHeader Add(QuoteHeader data, ref string errMsg);
        bool Remove(QuoteHeader data, ref string errMsg);
        QuoteHeader Update(QuoteHeader data, ref string errMsg);
        IList<QuoteHeader> GetList(string query, Filter filter, Sort sort, int page, int start, int limit, ref int totalRecords, ref string errorMsg);
    }
}
