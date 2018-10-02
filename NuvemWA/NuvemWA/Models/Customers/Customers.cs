using System;

namespace NuvemWA.Models
{
    public class Customer
    {
        public int CustKey { get; set; }
        public string CustName { get; set; }
        public string CustEmail { get; set; }
        public string CustCompanyName { get; set; }
        public string CustComercialName { get; set; }
        public string CustCNPJ { get; set; }
        public string CustIE { get; set; }
        public string CustIM { get; set; }
        public string CustAddress { get; set; }
        public string CustNeighborhood { get; set; }
        public int? CityKey { get; set; }
        public int? StateKey { get; set; }
        public string CustPhone1 { get; set; }
        public string CustPhone2 { get; set; }
        public int CustCreatedByUserKey { get; set; }
        public DateTime CustCreatedDate { get; set; }
        public int? CustModifiedByUserKey { get; set; }
        public Nullable<DateTime> CustModifiedDate { get; set; }
        public virtual string CityName { get; set; }
        public virtual string RegionName { get; set; }
        public virtual string StateName { get; set; }
        public virtual int? RegionKey { get; set; }
    }
}