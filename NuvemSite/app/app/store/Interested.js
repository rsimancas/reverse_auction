Ext.define('Nuvem.store.Interested', {
    extend: 'Ext.data.Store',
    alias: 'store.Interested',
    autoLoad: false,
    pageSize: 16,

    requires: [
        'Nuvem.model.Interested'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'Nuvem.model.Interested',
            remoteSort: true,
            proxy: {
                type: 'rest',
                url: Nuvem.GlobalSettings.webApiPath + 'Interested',
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