Ext.define('Nuvem.store.Currencies', {
    extend: 'Ext.data.Store',
    alias: 'store.Currencies',
    autoLoad: false,
    pageSize: 16,

    requires: [
        'Nuvem.model.Currencies'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'Nuvem.model.Currencies',
            remoteSort: true,
            proxy: {
                type: 'rest',
                url: Nuvem.GlobalSettings.webApiPath + 'Currencies',
                headers: {
                    'Authorization-Token': Nuvem.GlobalSettings.tokenAuth
                },
                reader: {
                    type: 'json',
                    root: 'data',
                    totalProperty: 'total',
                    successProperty: 'success',
                    idProperty: 'CurrencyCode'
                },
                writer: {
                    type: 'json'
                }
            }
        }, cfg)]);
    }
});
