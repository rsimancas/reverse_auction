using System;

namespace NuvemWA.Models
{
    public class UserRole
    {
        public int URoleKey { get; set; }
        public int UserKey { get; set; }
        public int RoleKey { get; set; }
        public DateTime URoleCreatedDate { get; set; }
    }
}