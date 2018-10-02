Ext.define('Nuvem.model.Items', {
    extend: 'Ext.data.Model',
    idProperty: 'ItemId',
    autoLoad: false,

    fields: [
        { name: 'ItemKey', type: 'int', defaultValue: null },
        { name: 'ItemType', type: 'int', defaultValue: null },
        { name: 'ItemName', type: 'string' },
        { name: 'ItemPartNumber', type: 'string', useNull: true, defaultValue: null },
        { name: 'ItemLastPrice', type: 'float', useNull: true, defaultValue: null },
        { name: 'ItemCreatedByUserKey', type: 'int', defaultValue: Nuvem.GlobalSettings.getCurrentUserKey() },
        { name: 'ItemCreatedDate', type: 'date', defaultValue: new Date() },
        { name: 'ItemModifiedByUserKey', type: 'int', useNull: true, defaultValue: null },
        { name: 'ItemModifiedDate', type: 'date', useNull: true, defaultValue: null },
        { name: 'ItemWeight', type: 'float', useNull: true, defaultValue: null },
        { name: 'ItemVolume', type: 'float', useNull: true, defaultValue: null },
        { name: 'ItemWidth', type: 'float', useNull: true, defaultValue: null },
        { name: 'ItemHeight', type: 'float', useNull: true, defaultValue: null },
        { name: 'ItemLength', type: 'float', useNull: true, defaultValue: null },
        { name: 'ItemIMPA', type: 'string' },
        { name: 'ItemNCM', type: 'string' },
        { name: 'ItemDescription', type: 'string', useNull: true, defaultValue: null },
        { name: 'ItemBrand', type: 'string', useNull: true, defaultValue: null },
    ],

    proxy: {
        type: 'rest',
        url: Nuvem.GlobalSettings.webApiPath + 'Items',
        headers: {
            'Authorization-Token': Nuvem.GlobalSettings.tokenAuth
        },
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'total',
            successProperty: 'success',
            messageProperty: 'message',
            idProperty: 'ItemId'
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
                    //Ext.global.console.warn(request.proxy.reader.jsonData.message);
                } else {
                    Ext.popupMsg.msg("Sucesso", "Registro exclu&#237;do com &#234;xito");
                }
            }
        }
    }
});
