using System;

namespace NuvemWA.Models
{
    public class CurrencyRate
    {
        public int CurrencyRateKey { get; set; }
        public string CurrencyCode { get; set; }
        public decimal CurrencyRateRate { get; set; }
        public DateTime CurrencyRateDate { get; set; }
        public virtual string CurrencyName { get; set; }
    }
}