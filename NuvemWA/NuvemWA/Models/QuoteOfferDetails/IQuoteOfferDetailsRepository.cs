namespace NuvemWA.Models
{
    using NuvemWA.Clases;
    using System.Collections.Generic;

    interface IQuoteOfferDetailsRepository
    {
        QuoteOfferDetail Get(int id);
        QuoteOfferDetail Add(QuoteOfferDetail data);
        bool Remove(QuoteOfferDetail data);
        QuoteOfferDetail Update(QuoteOfferDetail data);
        IList<QuoteOfferDetail> GetList(string query, FieldFilters filter, Sort sort, int page, int start, int limit, ref int totalRecords);
    }
}
