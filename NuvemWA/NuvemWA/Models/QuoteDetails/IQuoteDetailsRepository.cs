namespace NuvemWA.Models
{
    using NuvemWA.Clases;
    using System.Collections.Generic;

    interface IQuoteDetailsRepository
    {
        QuoteDetail Get(int id);
        QuoteDetail Add(QuoteDetail data);
        bool Remove(QuoteDetail data);
        QuoteDetail Update(QuoteDetail data);
        IList<QuoteDetail> GetList(string query, FieldFilters filter, Sort sort, int page, int start, int limit, ref int totalRecords);
    }
}
