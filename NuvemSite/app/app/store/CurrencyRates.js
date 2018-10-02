Ext.define('Nuvem.store.CurrencyRates', {
    extend: 'Ext.data.Store',
    alias: 'store.currencyRates',
    autoLoad: false,
    pageSize: 16,

    requires: [
        'Nuvem.model.CurrencyRates'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'Nuvem.model.CurrencyRates',
            remoteSort: true,
            proxy: {
                type: 'rest',
                url: Nuvem.GlobalSettings.webApiPath + 'CurrencyRates',
                headers: {
                    'Authorization-Token': Nuvem.GlobalSettings.tokenAuth
                },
                reader: {
                    type: 'json',
                    root: 'data',
                    totalProperty: 'total',
                    successProperty: 'success',
                    idProperty: 'CurrencyRateKey'
                },
                writer: {
                    type: 'json'
                }
            }
        }, cfg)]);
    }
});
