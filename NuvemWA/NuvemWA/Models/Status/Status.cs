using System;

namespace NuvemWA.Models
{
    public class Status
    {
        public int StatusKey { get; set; }
        public string StatusName { get; set; }
        public int StatusOrder { get; set; }
        public int StatusCreatedByUserKey { get; set; }
        public DateTime StatusCreatedDate { get; set; }
        public int? StatusModifiedByUserKey { get; set; }
        public Nullable<DateTime> StatusModifiedDate { get; set; }
    }
}