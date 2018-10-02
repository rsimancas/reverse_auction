using NuvemWA.Clases;
using System.Collections.Generic;

namespace NuvemWA.Models
{
    interface IUsersRepository
    {
        IList<User> GetList(FieldFilters fieldFilters, string query, Sort sort, int page, int start, int limit, ref int totalRecord);
        User Get(int id);
        User Add(User user);
        bool Remove(User user);
        User Update(User user);
        User ValidLogon(string userName, string userPassword);
        User ValidTokenLogon(string userName, string userPassword);
        string GenToken(string userEmail, string userPassword);
        bool CheckIfExists(string userEmail);
        bool CreateUser(UserSignup data, ref string message);
        bool ActivateUser(string usrName, string usrPWD);
        void FirstLogonOff(int UserKey);
    }
}
