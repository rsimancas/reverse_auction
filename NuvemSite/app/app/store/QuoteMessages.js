Ext.define('Nuvem.store.QuoteMessages', {
    extend: 'Ext.data.Store',
    alias: 'store.QuoteMessages',
    autoLoad: false,
    pageSize: 16,

    requires: [
        'Nuvem.model.QuoteMessages'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'Nuvem.model.QuoteMessages',
            remoteSort: true,
            proxy: {
                type: 'rest',
                url: Nuvem.GlobalSettings.webApiPath + 'QuoteMessages',
                headers: {
                    'Authorization-Token': Nuvem.GlobalSettings.tokenAuth
                },
                reader: {
                    type: 'json',
                    root: 'data',
                    totalProperty: 'total',
                    successProperty: 'success',
                    idProperty: 'QMessageKey'
                },
                writer: {
                    type: 'json'
                }
            }
        }, cfg)]);
    }
});