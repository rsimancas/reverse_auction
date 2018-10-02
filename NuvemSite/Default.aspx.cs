using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class _Default : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (Request.Cookies["Nuvem.AppAuth"] != null && Request.Cookies["Nuvem.CurrentUser"] != null)
        {
            var user = JsonConvert.DeserializeObject<User>(Request.Cookies["Nuvem.CurrentUser"].Value);

            if (user.CustKey > 0)
            {
                Response.Redirect("app/#!purchasers");
            }
            else if (user.VendorKey > 0)
            {
                Response.Redirect("app/#!vendors");
            }
        }
    }
}

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
    public virtual string RoleName { get; set; }
}