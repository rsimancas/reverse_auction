Ext.define('Nuvem.store.Users', {
    extend: 'Ext.data.Store',
    alias: 'store.Users',
    autoLoad: false,
    pageSize: 8,

    requires: [
        'Nuvem.model.Users'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'Nuvem.model.Users',
            remoteSort: true,
            proxy: {
                type: 'rest',
                url: Nuvem.GlobalSettings.webApiPath + 'Users',
                headers: {
                    'Authorization-Token': Nuvem.GlobalSettings.tokenAuth
                },
                reader: {
                    type: 'json',
                    root: 'data',
                    totalProperty: 'total',
                    successProperty: 'success',
                    idProperty: 'UserKey'
                },
                writer: {
                    type: 'json'
                }
            }
        }, cfg)]);
    }
});