namespace NuvemWA.Models
{
    using System;

    public class QuoteAnswer
    {
        public int QAnswerKey { get; set; }
        public int QHeaderKey { get; set; }
        public int VendorKey { get; set; }
        public string QAnswerComments { get; set; }
        public decimal QAnswerValue { get; set; }
        public DateTime QAnswerDateDelivery { get; set; }
        public int QAnswerCreatedByUserKey { get; set; }
        public DateTime QAnswerCreatedDate { get; set; }
        public virtual string UserName { get; set; }
        public virtual string VendorName { get; set; }
    }
}