Ext.define('Nuvem.store.CustShipAddress', {
    extend: 'Ext.data.Store',
    alias: 'store.CustShipAddress',
    autoLoad: false,
    pageSize: 16,

    requires: [
        'Nuvem.model.CustShipAddress'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'Nuvem.model.CustShipAddress',
            remoteSort: true,
            proxy: {
                type: 'rest',
                url: Nuvem.GlobalSettings.webApiPath + 'CustShipAddress',
                headers: {
                    'Authorization-Token': Nuvem.GlobalSettings.tokenAuth
                },
                reader: {
                    type: 'json',
                    root: 'data',
                    totalProperty: 'total',
                    successProperty: 'success',
                    idProperty: 'CustShipKey'
                },
                writer: {
                    type: 'json'
                }
            }
        }, cfg)]);
    }
});