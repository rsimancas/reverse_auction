using NuvemWA.Clases;
using System.Collections.Generic;

namespace NuvemWA.Models
{
    interface ICategoriesRepository
    {
        Category Get(int id);
        Category Add(Category data);
        bool Remove(Category data);
        Category Update(Category data);
        IList<Category> GetList(FieldFilters fieldFilters, string query, Sort sort, int page, int start, int limit, ref int totalRecords);
    }
}
