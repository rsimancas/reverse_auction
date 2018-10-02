Ext.define('Nuvem.controller.Home', {
    extend: 'Ext.app.Controller',

    models: [

    ],

    stores: [
        'Attachments',
        'CurrencyRates',
        'Customers',
        'CustShipAddress',
        'Items',
        'QuoteHeaders',
        'QuoteMessages',
        'QuoteOffers',
        'QuoteOfferDetails',
        'QuoteDetails',
        'Interested',
        'Sequences',
        'Status',
        'Users',
        'Vendors',
        'QuoteChart',
        'Images',
        'States',
        'Cities',
        'Categories',
        'Notifications',
        'VendorShipAddress',
        'VendorCategories'
    ],

    views: [
        'purchasers.EditItem',
        'common.ContentPanel',
        'common.MainHeader',
        'purchasers.ToolBar',
        'vendors.ToolBar',
        'vendors.General',
        'vendors.Panel',
        'vendors.EditUserInfo',
        'vendors.UsersList',
        'vendors.EditVendorInfo',
        'vendors.EditQuoteHeaderItem',
        'vendors.EditQuoteHeaderService',
        'vendors.EditQuoteHeaderMessages',
        'vendors.EditQuoteHeaderOffers',
        'vendors.Support',
        'vendors.EditVendorShipAddress',
        'purchasers.General',
        'purchasers.Panel',
        'purchasers.Support',
        'purchasers.EditItem',
        'purchasers.EditQuoteHeaderItem',
        'purchasers.EditQuoteHeaderService',
        'purchasers.EditQuoteHeaderMessages',
        'purchasers.EditQuoteHeaderOffers',
        'purchasers.EditCustInfo',
        'purchasers.EditCustShipAddress',
        'purchasers.EditUserInfo',
        'purchasers.UsersList'
    ],

    init: function(application) {
        /*Ext.checkSecurityToken();
        var user = Nuvem.GlobalSettings.currentUser;

        if(user.UserFirstLogon && user.VendorKey) {
            Ext.Router.redirect('!vendors/firstlogon');
            return;
        }

        debugger;
        Ext.each(Ext.Router.routes, function(route, index) { 
            var hash = window.location.hash;
            console.log(route.matcher.test(hash), hash);
        });

        console.log('application', window.location.hash, Ext.app.Application);

        if(user.VendorKey) {
            Ext.Router.redirect('!vendors');
            return;
        }

        if(user.CustKey) {
            Ext.Router.redirect('!purchasers');
            return;   
        }

        var askBeforeOut = function() {
            return 'Você quer sair?';
        };

        window.onbeforeunload = askBeforeOut;

        Nuvem.GlobalSettings.modeApp = 'admin';*/
    },

    initHome: function(params) {
        Ext.checkSecurityToken();
        var user = Nuvem.GlobalSettings.currentUser;

        if (user.CustKey) {
            Nuvem.GlobalSettings.modeApp = "purchasers";
        } else if (user.VendorKey) {
            Nuvem.GlobalSettings.modeApp = "vendors";
        }

        var hash = window.location.hash || "#!";
        Ext.each(Ext.ux.Router.routes, function(route, index) {
            if (route.matcher.test(hash.substring(1))) {
                var action = route.action;
                if (action === "initHome") {
                    if (Nuvem.GlobalSettings.modeApp === "purchasers")
                        Ext.Router.redirect('!purchasers');

                    if (Nuvem.GlobalSettings.modeApp === "vendors") {
                        if (user.UserFirstLogon) {
                            Ext.Router.redirect('!vendors/panel/firstlogon');
                        } else {
                            Ext.Router.redirect('!vendors');
                        }
                    }
                }
                return;
            }
        });
    }
});
