Ext.define('Nuvem.view.appViewPort', {
    extend: 'Ext.container.Viewport',
    xtype: 'app_viewport',
    itemId: 'appViewPort',
    layout: {
        type: 'border'
    },

    initComponent: function() {
        var me = this,
            widget = null;

        /*if (Nuvem.GlobalSettings.modeApp === 'purchasers') {
            widget = 'purchasersGeneral';
        } else {
            if (Nuvem.GlobalSettings.firstSession) {
                widget = 'vendorsPanel';
            } else {
                widget = 'vendorsGeneral';
            }
        }*/

        Ext.applyIf(me, {
            items: [{
                region: 'north',
                xtype: 'app_header',
                padding: '10 10 0 10'
            }, {
                region: 'center',
                xtype: 'app_ContentPanel',
                itemId: 'app_ContentPanel',
                forceFit: true,
                items: []
            }],
            listeners: {
                afterrender: function(vp, eOpts) {
                    Nuvem.AppEvents.fireEvent("viewportLoaded");
                }
            }
        });

        me.callParent(arguments);
    }
});
