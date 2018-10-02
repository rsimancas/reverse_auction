using System;

namespace NuvemWA.Models
{
    public class City
    {
        public int CityKey { get; set; }
        public string CityName { get; set; }
        public int StateKey { get; set; }
        public virtual int? CountryKey { get; set; }
        public virtual string CountryName { get; set; }
        public virtual int? RegionKey { get; set; }
        public virtual string RegionName { get; set; }
        public virtual string StateName { get; set; }
        public virtual string StateUF { get; set; }
    }
}