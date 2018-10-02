namespace NuvemWA.Models
{
    using System;

    public class QuoteMessage
    {
        public int QMessageKey { get; set; }
        public int QHeaderKey { get; set; }
        public string QMessageText { get; set; }
        public int? QMessageFromVendorKey { get; set; }
        public int? QMessageFromCustKey { get; set; }
        public int? QMessageToVendorKey { get; set; }
        public int? QMessageToCustKey { get; set; }
        public DateTime QMessageDate { get; set; }
        public bool QMessageRead { get; set; }
        public int QMessageCreatedByUserKey { get; set; }
        public virtual string FromVendorName { get; set; }
        public virtual string ToVendorName { get; set; }
        public virtual string FromCustName { get; set; }
        public virtual string ToCustName { get; set; }
    }
}