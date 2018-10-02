using System;

namespace NuvemWA.Models
{
    public class Currency
    {
        public string CurrencyCode { get; set; }
        public string CurrencySymbol { get; set; }
        public string CurrencyName { get; set; }
        public string CurrencyNativeSymbol { get; set; }
        public int CurrencyDecimalDigits { get; set; }
        public int CurrencyRounding { get; set; }
        public string CurrencyPluralName { get; set; }
    }
}