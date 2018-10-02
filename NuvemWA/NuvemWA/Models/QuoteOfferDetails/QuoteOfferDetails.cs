namespace NuvemWA.Models
{
    using System;

    public class QuoteOfferDetail
    {
        public int QOfferDetailKey { get; set; }

        public int QOfferKey { get; set; }

        public int ItemKey { get; set; }

        public decimal QOfferDetailQty { get; set; }

        public decimal QOfferDetailPrice { get; set; }

        public decimal QOfferDetailLinePrice { get; set; }

        public int QOfferDetailAccepted { get; set; }

        public Nullable<DateTime> QOfferDetailAcceptedDate { get; set; }

        public virtual string ItemName { get; set; }
    }
}