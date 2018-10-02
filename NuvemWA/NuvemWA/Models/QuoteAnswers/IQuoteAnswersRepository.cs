namespace NuvemWA.Models
{
    using NuvemWA.Clases;
    using System.Collections.Generic;

    interface IQuoteAnswersRepository
    {
        QuoteAnswer Get(int id);
        QuoteAnswer Add(QuoteAnswer data);
        bool Remove(QuoteAnswer data);
        QuoteAnswer Update(QuoteAnswer data);
        IList<QuoteAnswer> GetList(string query, FieldFilters filter, Sort sort, int page, int start, int limit, ref int totalRecords);
    }
}
