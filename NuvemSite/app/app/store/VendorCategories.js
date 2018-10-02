Ext.define('Nuvem.store.VendorCategories', {
    extend: 'Ext.data.Store',
    alias: 'store.VendorCategories',
    autoLoad: false,
    pageSize: 16,

    requires: [
        'Nuvem.model.VendorCategories'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'Nuvem.model.VendorCategories',
            remoteSort: true,
            proxy: {
                type: 'rest',
                url: Nuvem.GlobalSettings.webApiPath + 'VendorCategories',
                headers: {
                    'Authorization-Token': Nuvem.GlobalSettings.tokenAuth
                },
                reader: {
                    type: 'json',
                    root: 'data',
                    totalProperty: 'total',
                    successProperty: 'success',
                    idProperty: 'VendorCategoryKey'
                },
                writer: {
                    type: 'json'
                }
            }
        }, cfg)]);
    }
});
