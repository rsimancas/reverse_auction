Ext.define('Nuvem.store.QuoteHeaders', {
    extend: 'Ext.data.Store',
    alias: 'store.QuoteHeaders',
    autoLoad: false,
    pageSize: 16,

    requires: [
        'Nuvem.model.QuoteHeaders'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'Nuvem.model.QuoteHeaders',
            remoteSort: true,
            proxy: {
                type: 'rest',
                url: Nuvem.GlobalSettings.webApiPath + 'QuoteHeaders',
                headers: {
                    'Authorization-Token': Nuvem.GlobalSettings.tokenAuth
                },
                reader: {
                    type: 'json',
                    root: 'data',
                    totalProperty: 'total',
                    successProperty: 'success',
                    idProperty: 'QHeaderKey'
                },
                writer: {
                    type: 'json'
                }
            }
        }, cfg)]);
    }
});
