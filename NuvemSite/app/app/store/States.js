Ext.define('Nuvem.store.States', {
    extend: 'Ext.data.Store',
    alias: 'store.States',
    autoLoad: false,
    pageSize: 16,

    requires: [
        'Nuvem.model.States'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'Nuvem.model.States',
            remoteSort: true,
            proxy: {
                type: 'rest',
                url: Nuvem.GlobalSettings.webApiPath + 'States',
                headers: {
                    'Authorization-Token': Nuvem.GlobalSettings.tokenAuth
                },
                reader: {
                    type: 'json',
                    root: 'data',
                    totalProperty: 'total',
                    successProperty: 'success',
                    idProperty: 'StateKey'
                },
                writer: {
                    type: 'json'
                }
            }
        }, cfg)]);
    }

});
