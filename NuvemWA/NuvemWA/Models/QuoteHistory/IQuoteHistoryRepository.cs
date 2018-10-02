using System.Collections.Generic;

namespace NuvemWA.Models
{
    interface IQuoteHistoryRepository
    {
        QHistory Get(int id, ref string errMsg);
        QHistory Add(QHistory data, ref string errMsg);
        bool Remove(QHistory data, ref string errMsg);
        QHistory Update(QHistory data, ref string errMsg);
        IList<QHistory> GetList(string query, Sort sort, int page, int start, int limit, ref int totalRecords, ref string errorMsg);
    }
}
