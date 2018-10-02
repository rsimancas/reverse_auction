Ext.define('Nuvem.store.Attachments', {
    extend: 'Ext.data.Store',
    alias: 'store.Attachments',
    autoLoad: false,
    pageSize: 16,

    requires: [
        'Nuvem.model.Attachments'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'Nuvem.model.Attachments',
            remoteSort: true,
            proxy: {
                type: 'rest',
                url: Nuvem.GlobalSettings.webApiPath + 'Attachments',
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