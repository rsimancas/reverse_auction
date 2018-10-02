Ext.define('Nuvem.store.QuoteDetails', {
    extend: 'Ext.data.Store',
    alias: 'store.QuoteDetails',
    autoLoad: false,
    pageSize: 16,

    requires: [
        'Nuvem.model.QuoteDetails'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'Nuvem.model.QuoteDetails',
            remoteSort: true,
            proxy: {
                type: 'rest',
                url: Nuvem.GlobalSettings.webApiPath + 'QuoteDetails',
                headers: {
                    'Authorization-Token': Nuvem.GlobalSettings.tokenAuth
                },
                reader: {
                    type: 'json',
                    root: 'data',
                    totalProperty: 'total',
                    successProperty: 'success',
                    idProperty: 'QDetailKey'
                },
                writer: {
                    type: 'json'
                }
            }
        }, cfg)]);
    }
});