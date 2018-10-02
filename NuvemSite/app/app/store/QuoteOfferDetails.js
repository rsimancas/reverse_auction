Ext.define('Nuvem.store.QuoteOfferDetails', {
    extend: 'Ext.data.Store',
    alias: 'store.QuoteOfferDetails',
    autoLoad: false,
    pageSize: 16,

    requires: [
        'Nuvem.model.QuoteOfferDetails'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'Nuvem.model.QuoteOfferDetails',
            remoteSort: true,
            proxy: {
                type: 'rest',
                url: Nuvem.GlobalSettings.webApiPath + 'QuoteOfferDetails',
                headers: {
                    'Authorization-Token': Nuvem.GlobalSettings.tokenAuth
                },
                reader: {
                    type: 'json',
                    root: 'data',
                    totalProperty: 'total',
                    successProperty: 'success',
                    idProperty: 'QOfferDetailKey'
                },
                writer: {
                    type: 'json'
                }
            }
        }, cfg)]);
    }
});