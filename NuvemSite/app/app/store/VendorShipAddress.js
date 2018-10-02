Ext.define('Nuvem.store.VendorShipAddress', {
    extend: 'Ext.data.Store',
    alias: 'store.VendorShipAddress',
    autoLoad: false,
    pageSize: 16,

    requires: [
        'Nuvem.model.VendorShipAddress'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'Nuvem.model.VendorShipAddress',
            remoteSort: true,
            proxy: {
                type: 'rest',
                url: Nuvem.GlobalSettings.webApiPath + 'VendorShipAddress',
                headers: {
                    'Authorization-Token': Nuvem.GlobalSettings.tokenAuth
                },
                reader: {
                    type: 'json',
                    root: 'data',
                    totalProperty: 'total',
                    successProperty: 'success',
                    idProperty: 'VendorShipKey'
                },
                writer: {
                    type: 'json'
                }
            }
        }, cfg)]);
    }
});