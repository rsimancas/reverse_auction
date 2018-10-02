using NuvemWA.Clases;
using System.Collections.Generic;

namespace NuvemWA.Models
{
    interface IStatesRepository
    {
        State Get(int id);
        State Add(State data);
        bool Remove(State data);
        State Update(State data);
        IList<State> GetList(FieldFilters fieldFilters, string query, Sort sort, int page, int start, int limit, ref int totalRecords);
    }
}
