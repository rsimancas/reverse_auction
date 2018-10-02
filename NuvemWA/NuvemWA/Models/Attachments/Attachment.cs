using System;

namespace NuvemWA.Models
{
    public class Attached {
        public int AttachKey { get; set; }
        public string AttachName { get; set; }
        public string AttachContentType { get; set; }
        public string AttachFilePath { get; set; }
        public int? QHeaderKey { get; set; }
        public int? ItemKey { get; set; }
        public int? DocKey { get; set; }
        public int? CustKey { get; set; }
        public int? VendorKey { get; set; }
        public Nullable<bool> AttachDirty { get; set; }
        public DateTime AttachCreatedDate { get; set; }
        public int AttachCreatedByUserKey { get; set; }
    }
}