using System;

namespace NuvemWA.Models
{
    public class CustomerShipAddress
    {
        public int CustShipKey { get; set; }
        public int CustKey { get; set; }
        public bool CustShipDefault { get; set; }
        public string CustShipAddress { get; set; }
        public int CityKey { get; set; }
        public int StateKey { get; set; }
        public DateTime CustShipCreatedDate { get; set; }
        public int CustShipCreatedByUserKey { get; set; }
        public Nullable<DateTime> CustShipModifiedDate { get; set; }
        public int? CustShipModifiedByUserKey { get; set; }
        public virtual string CityName { get; set; }
        public virtual int? RegionKey { get; set; }
        public virtual string RegionName { get; set; }
        public virtual string StateName { get; set; }
    }
}