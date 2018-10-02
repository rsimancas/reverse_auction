namespace NuvemWA.Models
{
    using System;

    public class QuoteDetail
    {
        public int QDetailKey { get; set; }

        public int QHeaderKey { get; set; }

        public int ItemKey { get; set; }

        public decimal QDetailQty { get; set; }

        public int QDetailCreatedByUserKey { get; set; }

        public DateTime QDetailCreatedDate { get; set; }

        public int? QDetailModifiedByUserKey { get; set; }

        public Nullable<DateTime> QDetailModifiedDate { get; set; }

        #region virtual fields
        public virtual string ItemName { get; set; }
        public virtual string ItemNCM { get; set; }
        public virtual string ItemIMPA { get; set; }
        #endregion virtual fields
    }
}