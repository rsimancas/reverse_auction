Ext.define('Nuvem.store.Notifications', {
    extend: 'Ext.data.Store',
    alias: 'store.Notifications',
    autoLoad: false,
    pageSize: 16,

    requires: [
        'Nuvem.model.Notifications'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'Nuvem.model.Notifications',
            remoteSort: true,
            proxy: {
                type: 'rest',
                url: Nuvem.GlobalSettings.webApiPath + 'Notifications',
                headers: {
                    'Authorization-Token': Nuvem.GlobalSettings.tokenAuth
                },
                reader: {
                    type: 'json',
                    root: 'data',
                    totalProperty: 'total',
                    successProperty: 'success',
                    idProperty: 'NotifyKey'
                },
                writer: {
                    type: 'json'
                }
            }
        }, cfg)]);
    }
});