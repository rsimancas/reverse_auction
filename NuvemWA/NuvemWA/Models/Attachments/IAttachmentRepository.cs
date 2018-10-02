using System;
using System.Collections.Generic;

namespace NuvemWA.Models
{
    interface IAttachmentsRepository
    {
        IList<Attached> GetList(bool dirty, int currentUser, ref int totalRecords, ref string errMsg);

        Attached Update(IDictionary<String, object> data, int currentUser, ref string errMsg);

        bool Remove(Attached data, ref string errMsg);

        bool InsertAttach(string tempFile, int currentUser, bool dirty, string fileName, string contenttype, ref string errMsg);

        string GetFile(int attachId, ref string contentType, ref string errMsg);

        string GetThumbFile(int id, ref string contenttype, ref string errMsg);
    }
}
