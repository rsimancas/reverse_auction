namespace NuvemWA.Models
{
    using System;

    public class Interested
    {
        public int QHeaderKey { get; set; }

        public int? InterestedVendorKey { get; set; }

        public string InterestedVendorName { get; set; }

        public string InterestedVendorEmail { get; set; }

        public int? InterestedVendorMessages { get; set; }

        public string InterestedLastMessage { get; set; }

        public Nullable<DateTime> InterestedLastMessageDate { get; set; }
    }
}