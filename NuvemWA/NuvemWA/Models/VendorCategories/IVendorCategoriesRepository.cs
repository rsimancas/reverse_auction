namespace NuvemWA.Models
{
    using NuvemWA.Clases;
    using System.Collections.Generic;

    interface IVendorCategoriesRepository
    {
        VendorCategory Get(int id);
        VendorCategory Add(VendorCategory data);
        bool Remove(VendorCategory data);
        VendorCategory Update(VendorCategory data);
        IList<VendorCategory> GetList(string query, FieldFilters filter, Sort sort, int page, int start, int limit, ref int totalRecords);
    }
}
