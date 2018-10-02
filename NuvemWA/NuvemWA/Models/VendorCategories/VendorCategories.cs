namespace NuvemWA.Models
{
    using System;

    public class VendorCategory
    {
        public int VendorCategoryKey { get; set; }

        public int VendorKey { get; set; }

        public int CategoryKey { get; set; }

        public virtual string VendorName { get; set; }

        public virtual string CategoryName { get; set; }
    }
}