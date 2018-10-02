using System;

namespace NuvemWA.Models
{
    public class Category
    {
        public int CategoryKey { get; set; }
        public string CategoryName { get; set; }
        public int CategoryCreatedByUserKey { get; set; }
        public DateTime CategoryCreatedDate { get; set; }
        public int? CategoryModifiedByUserKey { get; set; }
        public Nullable<DateTime> CategoryModifiedDate { get; set; }
    }
}