namespace NuvemWA.Models
{
    using System;

    public class Vendor
    {
        public int VendorKey { get; set; }
        public string VendorName { get; set; }
        public string VendorEmail { get; set; }
        public string VendorCompanyName { get; set; }
        public string VendorComercialName { get; set; }
        public string VendorCNPJ { get; set; }
        public string VendorIE { get; set; }
        public string VendorIM { get; set; }
        public string VendorAddress { get; set; }
        public string VendorNeighborhood { get; set; }
        public int? CitiKey { get; set; }
        public int? StateKey { get; set; }
        public string VendorPhone1 { get; set; }
        public string VendorPhone2 { get; set; }
        public int VendorCreatedByUserKey { get; set; }
        public DateTime VendorCreatedDate { get; set; }
        public int? VendorModifiedByUserKey { get; set; }
        public Nullable<DateTime> VendorModifiedDate { get; set; }
        public bool VendorBrasil { get; set; }
        public bool VendorSudeste { get; set; }
        public bool VendorSul { get; set; }
        public bool VendorNordeste { get; set; }
        public bool VendorNorte { get; set; }
        public bool VendorCentroOeste { get; set; }
        public virtual string CityName { get; set; }
        public virtual string StateName { get; set; }
    }
}