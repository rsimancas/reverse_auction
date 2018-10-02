namespace NuvemWA.Models
{
    using NuvemWA.Clases;
    using System.Collections.Generic;

    interface INotificationsRepository
    {
        Notify Get(int id);
        Notify Add(Notify data);
        bool Remove(Notify data);
        Notify Update(Notify data);
        IList<Notify> GetList(string query, FieldFilters filter, Sort sort, int page, int start, int limit, ref int totalRecords);
    }
}
