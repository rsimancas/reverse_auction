using System;
using System.Collections.Generic;

namespace NuvemWA.Models
{
    interface IVendorsRepository
    {
        Vendor Get(int id, ref string errMsg);
        Vendor Add(Vendor model);
        bool Remove(int id, ref string errMsg);
        Vendor Update(IDictionary<String, object> data, ref string errMsg);
        IList<Vendor> GetList(string query, Sort sort, int page, int start, int limit, ref int totalRecords, ref string errorMsg);

        void CleanUserVendorSelections(int VendorId, string UserId);
    }
}
