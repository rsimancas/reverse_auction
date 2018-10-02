using NuvemWA.Clases;
using System.Collections.Generic;

namespace NuvemWA.Models
{
    interface IVendorShipAddressRepository
    {
        ModelVendorShipAddress Get(int id);
        ModelVendorShipAddress Add(ModelVendorShipAddress data);
        bool Remove(ModelVendorShipAddress data);
        ModelVendorShipAddress Update(ModelVendorShipAddress data);
        IList<ModelVendorShipAddress> GetList(FieldFilters fieldFilters, string query, Sort sort, int page, int start, int limit, ref int totalRecords);
    }
}