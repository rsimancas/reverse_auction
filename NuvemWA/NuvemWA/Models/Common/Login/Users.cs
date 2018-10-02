using System;

namespace NuvemWA.Models
{
    public class User
    {
        public int UserKey { get; set; }
        public string UserEmail { get; set; }
        public string UserName { get; set; }
        public string UserPassword { get; set; }
        public int? CustKey { get; set; }
        public int? VendorKey { get; set; }
        public int? UserCreatedByUserKey { get; set; }
        public DateTime UserCreatedDate { get; set; }
        public int? UserModifiedByUserKey { get; set; }
        public bool UserConfirmed { get; set; }
        public string UserCPF { get; set; }
        public string UserPhone { get; set; }
        public string UserCell { get; set; }
        public int? ParentUserKey { get; set; }
        public string UserPosition { get; set; }
        public virtual string VendorName { get; set; }
        public virtual string CustName { get; set; }
        public virtual int? RoleKey { get; set; }
        public virtual string RoleName { get; set; }
        public bool UserFirstLogon { get; set; }
    }

    public class UserSignup
    {
        public string UserName { get; set; }
        public string UserEmail { get; set; }
        public string UserPassword { get; set; }
        public string registerMode { get; set; }
    }


    public class UserLocation
    {
        public string ip { get; set; }
        public string country_code { get; set; }
        public string country_name { get; set; }
        public string region_code { get; set; }
        public string region_name { get; set; }
        public string city { get; set; }
        public string zip_code { get; set; }
        public string time_zone { get; set; }
        public double latitude { get; set; }
        public double longitude { get; set; }
        public int metro_code { get; set; }
    }
}