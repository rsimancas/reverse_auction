using System;

namespace NuvemWA.Models
{
    public class QuoteHeader
    {
        public int QHeaderKey { get; set; }
        public Nullable<DateTime> QHeaderDateBegin { get; set; }
        public Nullable<DateTime> QHeaderDateEnd { get; set; }
        public string QHeaderIMPA { get; set; }
        public string QHeaderCEP_R { get; set; }
        public string QHeaderCEP_E { get; set; }
        public int CustKey { get; set; }
        public int? CustShipKey { get; set; }
        public Nullable<DateTime> QHeaderDateRequired { get; set; }
        public Nullable<bool> QHeaderBrasil { get; set; }
        public Nullable<bool> QHeaderSudeste { get; set; }
        public Nullable<bool> QHeaderSul { get; set; }
        public Nullable<bool> QHeaderNordeste { get; set; }
        public Nullable<bool> QHeaderNorte { get; set; }
        public Nullable<bool> QHeaderCentroOeste { get; set; }
        public string QHeaderOC { get; set; }
        public Nullable<DateTime> QHeaderOCDate { get; set; }
        public int QHeaderCreatedByUserKey { get; set; }
        public DateTime QHeaderCreatedDate { get; set; }
        public int? QHeaderModifiedByUserKey { get; set; }
        public Nullable<DateTime> QHeaderModifiedDate { get; set; }
        public Nullable<DateTime> QHeaderEstimatedDate { get; set; }
        public string QHeaderComments { get; set; }
        public bool QHeaderDraft { get; set; }
        public int QHeaderStatus { get; set; }
        public int CategoryKey { get; set; }
        public int QHeaderType { get; set; }
        public virtual string CustName { get; set; }
        public virtual string CustShipAddress { get; set; }
        public virtual string CategoryName { get; set; }
        public virtual int Interested { get; set; }
        public virtual int Offers { get; set; }
        public virtual bool isFinished { get; set; }
        public virtual bool TotalItems { get; set; }
        public virtual bool wasCancelled { get; set; }
        public virtual bool wasDesisted { get; set; }
    }
}