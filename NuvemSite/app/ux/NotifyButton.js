Ext.define('Ext.ux.NotifyButton', {
    extend: 'Ext.Component',
    xtype: 'notifybutton',
    count: 0,
    tplOn: '<a href="javascript:void(0);" class="ux-notify"><i class="fa fa-bell"></i><span class="ux-badge">{0}</span></a>',
    tplOff: '<a href="javascript:void(0);" class="ux-notify"><i class="fa fa-bell"></i></a>',
    renderTo: Ext.getBody(),
    store: null,
    initComponent: function() {
        var me = this;
        if (me.count) {
            me.update(me.tplOn.format(me.count));
        } else {
            me.update(me.tplOff.format(me.count));
        }

        Nuvem.AppEvents.on('notification', me.onNotification, me);
        
        setTimeout(function() {
            Nuvem.AppEvents.fireEvent('notification');
        }, 1500);

        setInterval(function() {
            Nuvem.AppEvents.fireEvent('notification');
        }, 300000);
    },
    updateHTML: function(value) {
        var me = this;

        if (me.count) {
            me.update(me.tplOn.format(me.count));
        } else {
            me.update(me.tplOff.format(me.count));
        }
    },

    onNotification: function(record) {
        var me = this;
        if (Nuvem.GlobalSettings.modeApp === "purchasers") {
            me.checkPurchasersNotifications();
        } else if (Nuvem.GlobalSettings.modeApp === "vendors") {
            me.checkVendorsNotifications();
        }

        //me.count += 1;
        //me.updateHTML();
    },

    resetNotifications: function() {
        var me = this;
        me.count = 0;
        me.updateHTML();
    },

    checkPurchasersNotifications: function() {
        var me = this,
            CustKey = Nuvem.GlobalSettings.getCurrentUserCustKey();

        me.store = new Nuvem.store.Notifications({ autoLoad: false });
        me.resetNotifications();

        me.store.load({
            params: {
                page: 0,
                start: 0,
                limit: 0,
                fieldFilters: JSON.stringify({
                    fields: [
                        { name: 'CustKey', type: 'int', value: CustKey },
                        { name: 'NotifyRead', type: 'int', value: 0 }
                    ]
                })
            },
            callback: function(records, success, eOpts) {
                if (records && records.length) {
                    me.count = records.length;
                    me.updateHTML();
                } else {
                    me.count = 0;
                    me.updateHTML();
                }
            }
        });
    },

    checkVendorsNotifications: function() {
        var me = this,
            VendorKey = Nuvem.GlobalSettings.getCurrentUserVendorKey();

        me.store = new Nuvem.store.Notifications({ autoLoad: false });
        me.resetNotifications();

        me.store.load({
            params: {
                page: 0,
                start: 0,
                limit: 0,
                fieldFilters: JSON.stringify({
                    fields: [
                        { name: 'VendorKey', type: 'int', value: VendorKey },
                        { name: 'NotifyRead', type: 'int', value: 0 }
                    ]
                })
            },
            callback: function(records, success, eOpts) {
                if (records && records.length) {
                    me.count = records.length;
                    me.updateHTML();
                } else {
                    me.count = 0;
                    me.updateHTML();
                }
            }
        });
    }
});
