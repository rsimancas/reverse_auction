namespace NuvemWA.Models
{
    using System;

    public class Notify
    {
        public int NotifyKey { get; set; }

        public string NotifyDescription { get; set; }

        public int? QHeaderKey { get; set; }

        public int? CustKey { get; set; }

        public int? VendorKey { get; set; }

        public int? UserKey { get; set; }

        public DateTime NotifyDate { get; set; }

        public string NotifyDefinition { get; set; }

        public string NotifyArguments { get; set; }

        public bool NotifyRead { get; set; }

        public string CustName { get; set; }

        public string VendorName { get; set; }
    }
}