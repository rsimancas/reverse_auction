using NuvemWA.Clases;
using System.Collections.Generic;

namespace NuvemWA.Models
{
    interface ICustShipAddressRepository
    {
        CustomerShipAddress Get(int id);
        CustomerShipAddress Add(CustomerShipAddress data);
        bool Remove(CustomerShipAddress data);
        CustomerShipAddress Update(CustomerShipAddress data);
        IList<CustomerShipAddress> GetList(FieldFilters fieldFilters, string query, Sort sort, int page, int start, int limit, ref int totalRecords);
    }
}