using System;

namespace NuvemWA.Models
{
    public class ModelVendorShipAddress
    {
        //public int VendorShipKey { get; set; }
        //public int VendorKey { get; set; }
        //public bool VendorShipDefault { get; set; }
        //public string VendorShipAddress { get; set; }
        //public int CityKey { get; set; }
        //public int StateKey { get; set; }
        //public DateTime VendorShipCreatedDate { get; set; }
        //public int VendorShipCreatedByUserKey { get; set; }
        //public Nullable<DateTime> VendorShipModifiedDate { get; set; }
        //public int? VendorShipModifiedByUserKey { get; set; }
        //public virtual string CityName { get; set; }
        //public virtual int? RegionKey { get; set; }
        //public virtual string RegionName { get; set; }
        //public virtual string StateName { get; set; }

        public int VendorShipKey { get; set; }

        public int? VendorKey { get; set; }

        public bool VendorShipDefault { get; set; }

        public string VendorShipAddress { get; set; }

        public int? CityKey { get; set; }

        public int? StateKey { get; set; }

        public virtual string CityName { get; set; }

        public virtual string StateName { get; set; }

        public virtual string RegionName { get; set; }

        public virtual int RegionKey { get; set; }
    }
}