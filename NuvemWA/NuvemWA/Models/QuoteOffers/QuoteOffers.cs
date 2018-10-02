namespace NuvemWA.Models
{
    using System;

    public class QuoteOffer
    {
        public int QOfferKey { get; set; }

        public int QHeaderKey { get; set; }

        public int VendorKey { get; set; }

        public string QOfferComments { get; set; }

        public decimal QOfferValue { get; set; }

        public DateTime QOfferDeliveryDate { get; set; }

        public int QOfferCreatedByUserKey { get; set; }

        public DateTime QOfferCreatedDate { get; set; }

        public int? QOfferModifiedByUserKey { get; set; }

        public Nullable<DateTime> QOfferModifiedDate { get; set; }

        public int QOfferAccepted { get; set; }

        public Nullable<DateTime> QOfferAcceptedDate { get; set; }

        public bool QOfferDraft { get; set; }

        public int QOfferStatus { get; set; }

        public virtual string VendorName { get; set; }
        public virtual bool wasDesisted { get; set; }
        public virtual Nullable<bool> isFinished { get; set; }
    }

    public class AcceptedOffer
    {
        public int QOfferKey { get; set; }
    }

    public class QuoteInterested
    {
        public int QHeaderKey { get; set; }
        public int VendorKey { get; set; }
        public string VendorName { get; set; }
        public string VendorEmail { get; set; }
        public string UserEmail { get; set; }
        public string UserName { get; set; }
    }
}