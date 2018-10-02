Ext.define('Nuvem.store.QuoteOffers', {
    extend: 'Ext.data.Store',
    alias: 'store.QuoteOffers',
    autoLoad: false,
    pageSize: 16,

    requires: [
        'Nuvem.model.QuoteOffers'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'Nuvem.model.QuoteOffers',
            remoteSort: true,
            proxy: {
                type: 'rest',
                url: Nuvem.GlobalSettings.webApiPath + 'QuoteOffers',
                headers: {
                    'Authorization-Token': Nuvem.GlobalSettings.tokenAuth
                },
                reader: {
                    type: 'json',
                    root: 'data',
                    totalProperty: 'total',
                    successProperty: 'success',
                    idProperty: 'QOfferKey'
                },
                writer: {
                    type: 'json'
                }
            }
        }, cfg)]);
    }
});