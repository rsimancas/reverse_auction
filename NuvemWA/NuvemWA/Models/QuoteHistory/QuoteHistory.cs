using System;

namespace NuvemWA.Models
{
    public class QHistory
    {
        public int QHistoryKey { get; set; }
        public int? QHeaderKey { get; set; }
        public int QHistoryCreatedByUserKey { get; set; }
        public DateTime QHistoryCreatedDate { get; set; }
        public string QHistoryComments { get; set; }
        public int? QHistoryModifiedByUserKey { get; set; }
        public Nullable<DateTime> QHistoryModifiedDate { get; set; }
    }
}