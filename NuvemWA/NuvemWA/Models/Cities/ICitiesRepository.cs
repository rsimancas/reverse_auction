using NuvemWA.Clases;
using System.Collections.Generic;

namespace NuvemWA.Models
{
    interface ICitiesRepository
    {
        City Get(int id);
        City Add(City data);
        bool Remove(City data);
        City Update(City data);
        IList<City> GetList(FieldFilters fieldFilters, string query, Sort sort, int page, int start, int limit, ref int totalRecords);
    }
}
