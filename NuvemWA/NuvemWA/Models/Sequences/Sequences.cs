using System;

namespace NuvemWA.Models
{
    public class Sequences
    {
        public int SeqKey { get; set; }
        public string SeqName { get; set; }
        public int SeqValue { get; set; }
        public string SeqPrefix { get; set; }
        public DateTime SeqCreatedDate { get; set; }
        public int SeqCreatedByUserKey { get; set; }
        public Nullable<DateTime> SeqModifiedDate { get; set; }
        public int? SeqModifiedByUserKey { get; set; }
    }
}