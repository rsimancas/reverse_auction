using System;

namespace NuvemWA.Models
{
    interface IResourcesRepository
    {
        Nullable<DateTime> GetPreviousDate(int daysAgo, ref string errMsg);
    }
}
