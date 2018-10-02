Ext.define('Nuvem.store.Vendors', {
    extend: 'Ext.data.Store',
    alias: 'store.Vendors',
    autoLoad: false,
    pageSize: 16,

    requires: [
        'Nuvem.model.Vendors'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'Nuvem.model.Vendors',
            remoteSort: true,
            proxy: {
                type: 'rest',
                url: Nuvem.GlobalSettings.webApiPath + 'Vendors',
                headers: {
                    'Authorization-Token': Nuvem.GlobalSettings.tokenAuth
                },
                reader: {
                    type: 'json',
                    root: 'data',
                    totalProperty: 'total',
                    successProperty: 'success',
                    idProperty: 'VendorId'
                },
                writer: {
                    type: 'json'
                }
            }
        }, cfg)]);
    }
});