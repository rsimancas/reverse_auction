Ext.define('Nuvem.store.Status', {
    extend: 'Ext.data.Store',
    alias: 'store.Status',
    autoLoad: false,
    //pageSize: 16,

    requires: [
        'Nuvem.model.Status'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'Nuvem.model.Status',
            remoteSort: true,
            proxy: {
                type: 'rest',
                url: Nuvem.GlobalSettings.webApiPath + 'Status',
                headers: {
                    'Authorization-Token': Nuvem.GlobalSettings.tokenAuth
                },
                reader: {
                    type: 'json',
                    root: 'data',
                    totalProperty: 'total',
                    successProperty: 'success',
                    idProperty: 'StatusId'
                },
                writer: {
                    type: 'json'
                }
            }
        }, cfg)]);
    }
});