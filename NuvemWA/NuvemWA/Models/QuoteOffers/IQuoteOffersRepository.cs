namespace NuvemWA.Models
{
    using NuvemWA.Clases;
    using System.Collections.Generic;

    interface IQuoteOffersRepository
    {
        QuoteOffer Get(int id);
        QuoteOffer Add(QuoteOffer data);
        bool Remove(QuoteOffer data);
        QuoteOffer Update(QuoteOffer data);
        IList<QuoteOffer> GetList(string query, FieldFilters filter, Sort sort, int page, int start, int limit, ref int totalRecords);
        QuoteOffer AcceptOffer(int QOfferKey);
    }
}
