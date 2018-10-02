namespace NuvemWA.Models
{
    using NuvemWA.Clases;
    using System.Collections.Generic;

    interface IInterestedRepository
    {
        Interested Get(int id);
        IList<Interested> GetList(string query, FieldFilters filter, Sort sort, int page, int start, int limit, ref int totalRecords);
    }
}
