using System.Collections.Generic;

namespace NuvemWA.Models
{
    interface IRolesRepository
    {
        Role Get(int id, ref string errMsg);
        Role Add(Role data, ref string errMsg);
        bool Remove(Role data, ref string errMsg);
        Role Update(Role data, ref string errMsg);
        IList<Role> GetList(string query, Sort sort, int page, int start, int limit, ref int totalRecords, ref string errorMsg);
    }
}
