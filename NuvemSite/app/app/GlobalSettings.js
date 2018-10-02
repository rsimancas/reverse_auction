Ext.define('Nuvem.GlobalSettings', {
    singleton: true,
    webApiPath: '../../wa/api/',
    //webApiPath: 'http://localhost/nuvem/wa/api/',
    //webApiPath: 'http://localhost:26065/api/',
    tokenAuth: Ext.util.Cookies.get('Nuvem.AppAuth'),
    currentUser: Ext.JSON.decode(Ext.util.Cookies.get("Nuvem.CurrentUser")),
    modeApp: null,
    firstSession: false,
    currentRoute: "",

    // Methods
    getTokenAuth: function() {
        this.tokenAuth = Ext.util.Cookies.get('Nuvem.AppAuth');
        return this.tokenAuth;
    },
    getCurrentUser: function() {
        if (this.currentUser) {
            return this.currentUser;
        } else {
            return null;
        }
    },
    getCurrentUserKey: function() {
        if (this.currentUser) {
            return this.currentUser.UserKey;
        } else {
            return null;
        }
    },
    getCurrentUserRole: function() {
        if (this.currentUser) {
            return this.currentUser.RoleName;
        } else {
            return null;
        }
    },
    getCurrentUserCustKey: function() {
        if (this.currentUser) {
            return this.currentUser.CustKey;
        } else {
            return null;
        }
    },
    getCurrentUserVendorKey: function() {
        if (this.currentUser) {
            return this.currentUser.VendorKey;
        } else {
            return null;
        }
    }
});
