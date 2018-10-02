Ext.define('Nuvem.model.VendorShipAddress', {
    extend: 'Ext.data.Model',
    autoLoad: false,
    idProperty: 'VendorShipKey',

    fields: [
        { name: 'VendorShipKey', type: 'int', defaultValue: null },
        { name: 'VendorKey', type: 'int', useNull: true, defaultValue: null },
        { name: 'VendorShipDefault', type: 'boolean', defaultValue: null },
        { name: 'VendorShipAddress', type: 'string' },
        { name: 'CityKey', type: 'int', useNull: true, defaultValue: null },
        { name: 'StateKey', type: 'int', useNull: true, defaultValue: null },
        { name: 'CityName', type: 'string' },
        { name: 'StateName', type: 'string' },
        { name: 'RegionName', type: 'string' },
        { name: 'RegionKey', type: 'int', defaultValue: null }
    ],

    proxy: {
        type: 'rest',
        url: Nuvem.GlobalSettings.webApiPath + 'VendorShipAddress',
        headers: {
            'Authorization-Token': Nuvem.GlobalSettings.tokenAuth
        },
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'total',
            successProperty: 'success',
            messageProperty: 'message',
            idProperty: 'VendorShipKey'
        },
        afterRequest: function(request, success) {
            if (request.action == 'read') {
                //this.readCallback(request);
            } else if (request.action == 'create') {
                if (!request.operation.success) {
                    Ext.popupMsg.msg("Aviso", "O registo n&#227;o foi salvo com &#234;xito");
                    Ext.global.console.warn(request.proxy.reader.jsonData.message);
                } else {
                    Ext.popupMsg.msg("Sucesso", "Registro atualizado com &#234;xito");
                }
            } else if (request.action == 'update') {
                if (!request.operation.success) {
                    Ext.popupMsg.msg("Aviso", "O registo n&#227;o foi salvo com &#234;xito");
                    Ext.global.console.warn(request.proxy.reader.jsonData.message);
                } else {
                    Ext.popupMsg.msg("Sucesso", "Registro atualizado com &#234;xito");
                }
            } else if (request.action == 'destroy') {
                if (!request.operation.success) {
                    Ext.popupMsg.msg("Aviso", "O registo n&#227;o foi exclu&#237;do com &#234;xito");
                } else {
                    Ext.popupMsg.msg("Sucesso", "Registro exclu&#237;do com &#234;xito");
                }
            }
        }
    }
});
