namespace NuvemWA.Models
{
    using NuvemWA.Clases;
    using System.Collections.Generic;

    interface IQuoteMessagesRepository
    {
        QuoteMessage Get(int id);
        QuoteMessage Add(QuoteMessage data);
        bool Remove(QuoteMessage data);
        QuoteMessage Update(QuoteMessage data);
        IList<QuoteMessage> GetList(string query, FieldFilters filter, Sort sort, int page, int start, int limit, ref int totalRecords);
    }
}
