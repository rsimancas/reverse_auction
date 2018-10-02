Ext.define('Nuvem.store.Items', {
    extend: 'Ext.data.Store',
    alias: 'store.Items',
    autoLoad: false,
    pageSize: 16,

    requires: [
        'Nuvem.model.Items'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'Nuvem.model.Items',
            remoteSort: true,
            proxy: {
                type: 'rest',
                url: Nuvem.GlobalSettings.webApiPath + 'Items',
                headers: {
                    'Authorization-Token': Nuvem.GlobalSettings.tokenAuth
                },
                reader: {
                    type: 'json',
                    root: 'data',
                    totalProperty: 'total',
                    successProperty: 'success',
                    idProperty: 'ItemId'
                },
                writer: {
                    type: 'json'
                }
            }
        }, cfg)]);
    }
});