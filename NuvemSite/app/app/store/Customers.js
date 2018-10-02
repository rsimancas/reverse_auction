Ext.define('Nuvem.store.Customers', {
    extend: 'Ext.data.Store',
    alias: 'store.Customers',
    autoLoad: false,
    pageSize: 16,

    requires: [
        'Nuvem.model.Customers'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'Nuvem.model.Customers',
            remoteSort: true,
            proxy: {
                type: 'rest',
                url: Nuvem.GlobalSettings.webApiPath + 'Customers',
                headers: {
                    'Authorization-Token': Nuvem.GlobalSettings.tokenAuth
                },
                reader: {
                    type: 'json',
                    root: 'data',
                    totalProperty: 'total',
                    successProperty: 'success',
                    idProperty: 'CustKey'
                },
                writer: {
                    type: 'json'
                }
            }
        }, cfg)]);
    }

});
