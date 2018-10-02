using System;

namespace NuvemWA.Models
{
    public class Item
    {
        public int ItemKey { get; set; }
        public int ItemType { get; set; }
        public string ItemName { get; set; }
        public string ItemDescription { get; set; }
        public string ItemPartNumber { get; set; }
        public Nullable<decimal> ItemLastPrice { get; set; }
        public int ItemCreatedByUserKey { get; set; }
        public DateTime ItemCreatedDate { get; set; }
        public int? ItemModifiedByUserKey { get; set; }
        public Nullable<DateTime> ItemModifiedDate { get; set; }
        public Nullable<decimal> ItemWeight { get; set; }
        public Nullable<decimal> ItemVolume { get; set; }
        public Nullable<decimal> ItemWidth { get; set; }
        public Nullable<decimal> ItemHeight { get; set; }
        public Nullable<decimal> ItemLength { get; set; }
        public string ItemIMPA { get; set; }
        public string ItemNCM { get; set; }
    }
}