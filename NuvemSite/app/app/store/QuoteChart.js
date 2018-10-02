Ext.define('Nuvem.store.QuoteChart', {
    extend: 'Ext.data.Store',
    alias: 'store.QuoteChart',
    autoLoad: false,
    pageSize: 16,

    requires: [
        'Nuvem.model.QuoteChart'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'Nuvem.model.QuoteChart',
            remoteSort: true,
            proxy: {
                type: 'rest',
                url: Nuvem.GlobalSettings.webApiPath + 'QuoteChart',
                headers: {
                    'Authorization-Token': Nuvem.GlobalSettings.tokenAuth
                },
                reader: {
                    type: 'json',
                    root: 'data',
                    totalProperty: 'total',
                    successProperty: 'success'
                },
                writer: {
                    type: 'json'
                }
            }
        }, cfg)]);
    }
});
