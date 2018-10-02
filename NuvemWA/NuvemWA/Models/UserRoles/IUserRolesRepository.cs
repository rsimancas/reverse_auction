using System.Collections.Generic;

namespace NuvemWA.Models
{
    interface IUserRolesRepository
    {
        UserRole Get(int id, ref string errMsg);
        UserRole Add(UserRole data, ref string errMsg);
        bool Remove(UserRole data, ref string errMsg);
        UserRole Update(UserRole data, ref string errMsg);
        IList<UserRole> GetList(string query, Sort sort, int page, int start, int limit, ref int totalRecords, ref string errorMsg);
    }
}
