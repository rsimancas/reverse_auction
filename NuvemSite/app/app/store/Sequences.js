Ext.define('Nuvem.store.Sequences', {
    extend: 'Ext.data.Store',
    alias: 'store.Sequences',
    autoLoad: false,
    pageSize: 16,

    requires: [
        'Nuvem.model.Sequences'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'Nuvem.model.Sequences',
            remoteSort: true,
            proxy: {
                type: 'rest',
                url: Nuvem.GlobalSettings.webApiPath + 'Sequences',
                headers: {
                    'Authorization-Token': Nuvem.GlobalSettings.tokenAuth
                },
                reader: {
                    type: 'json',
                    root: 'data',
                    totalProperty: 'total',
                    successProperty: 'success',
                    idProperty: 'SeqId'
                },
                writer: {
                    type: 'json'
                }
            }
        }, cfg)]);
    }
});
