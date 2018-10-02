using System;

namespace NuvemWA.Models
{
    public class Role
    {
        public int RoleKey { get; set; }
        public string RoleName { get; set; }
        public DateTime RoleCreatedDate { get; set; }
        public Nullable<DateTime> RoleModifiedDate { get; set; }
    }
}