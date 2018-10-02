Ext.define('Nuvem.store.Cities', {
    extend: 'Ext.data.Store',
    alias: 'store.Cities',
    autoLoad: false,
    pageSize: 16,

    requires: [
        'Nuvem.model.Cities'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'Nuvem.model.Cities',
            remoteSort: true,
            proxy: {
                type: 'rest',
                url: Nuvem.GlobalSettings.webApiPath + 'Cities',
                headers: {
                    'Authorization-Token': Nuvem.GlobalSettings.tokenAuth
                },
                reader: {
                    type: 'json',
                    root: 'data',
                    totalProperty: 'total',
                    successProperty: 'success',
                    idProperty: 'CityKey'
                },
                writer: {
                    type: 'json'
                }
            }
        }, cfg)]);
    }

});
