Ext.define('Nuvem.store.Categories', {
    extend: 'Ext.data.Store',
    alias: 'store.Categories',
    autoLoad: false,
    pageSize: 16,

    requires: [
        'Nuvem.model.Categories'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'Nuvem.model.Categories',
            remoteSort: true,
            proxy: {
                type: 'rest',
                url: Nuvem.GlobalSettings.webApiPath + 'Categories',
                headers: {
                    'Authorization-Token': Nuvem.GlobalSettings.tokenAuth
                },
                reader: {
                    type: 'json',
                    root: 'data',
                    totalProperty: 'total',
                    successProperty: 'success',
                    idProperty: 'CategoryKey'
                },
                writer: {
                    type: 'json'
                }
            }
        }, cfg)]);
    }

});
