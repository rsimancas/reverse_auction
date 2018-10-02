Ext.define('Nuvem.store.Images', {
    extend: 'Ext.data.Store',
    alias: 'store.Images',
    autoLoad: false,
    pageSize: 16,

    requires: [
        'Nuvem.model.Images'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'Nuvem.model.Images',
            remoteSort: true,
            proxy: {
                type: 'rest',
                url: Nuvem.GlobalSettings.webApiPath + 'Images',
                headers: {
                    'Authorization-Token': Nuvem.GlobalSettings.tokenAuth
                },
                reader: {
                    type: 'json',
                    root: 'data',
                    totalProperty: 'total',
                    successProperty: 'success',
                    idProperty: 'AttachId'
                },
                writer: {
                    type: 'json'
                }
            }
        }, cfg)]);
    }
});
