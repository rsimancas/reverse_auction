Ext.define('Nuvem.view.common.MainHeader', {
    extend: 'Ext.container.Container',
    xtype: 'app_header',
    autorRender: true,
    autoShow: true,
    frame: true,
    split: false,
    style: {
        backgroundColor: "#000"
    },
    height: 60,

    layout: {
        type: 'column'
    },

    initComponent: function() {
        var me = this,
            currentUser = Nuvem.GlobalSettings.currentUser,
            toolType = 'app_toolbar';

        if (currentUser.CustKey) {
            Nuvem.GlobalSettings.modeApp = "purchasers";
            toolType = 'app_toolbar_purchasers';
        } else if (currentUser.VendorKey) {
            Nuvem.GlobalSettings.modeApp = "vendors";
            toolType = 'app_toolbar_vendors';
        }

        Ext.applyIf(me, {
            items: [{
                xtype: 'container',
                html: '<div><img src="images/logo_header.png" height="40"/></div>',
                columnWidth: 0.15
            }, {
                xtype: toolType,
                columnWidth: 0.85,
                border: 0,
                margin: '0 0 0 0'
            }]
        });

        me.callParent(arguments);
    }
});
