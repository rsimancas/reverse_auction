using System;

namespace NuvemWA.Models
{
    public class State
    {
        public int StateKey { get; set; }
        public string StateName { get; set; }
        public string StateUF { get; set; }
        public int RegionKey { get; set; }
        public int CountryKey { get; set; }
        public virtual string RegionName { get; set; }
        public virtual string CountryName { get; set; }
    }
}