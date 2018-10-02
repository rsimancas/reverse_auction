Ext.define('Nuvem.model.CustShipAddress', {
    extend: 'Ext.data.Model',
    autoLoad: false,
    idProperty: 'CustShipKey',
    
    fields: [
        { name:'CustShipKey', type:'int', defaultValue: null },
        { name:'CustKey', type:'int', defaultValue: null },
        { name:'CustShipDefault', type:'boolean', defaultValue: null },
        { name:'CustShipAddress', type:'string', useNull: true, defaultValue: null },
        { name:'CityKey', type:'int', defaultValue: null },
        { name:'StateKey', type:'int', useNull:true, defaultValue: null },
        { name:'CustShipCreatedDate', type:'date', defaultValue: new Date() },
        { name:'CustShipCreatedByUserKey', type:'int', defaultValue: Nuvem.GlobalSettings.getCurrentUserKey() },
        { name:'CustShipModifiedDate', type:'date', useNull: true, defaultValue: null },
        { name:'CustShipModifiedByUserKey', type:'int', useNull: true, defaultValue: null },
        { name:'CityName', type:'string' },
        { name:'RegionKey', useNull: true, type:'int', defaultValue: null },
        { name:'RegionName', type:'string' },
        { name:'StateKey', useNull: true, type:'int', defaultValue: null },
        { name:'StateName', type:'string' }
    ],

    proxy: {
        type: 'rest',
        url: Nuvem.GlobalSettings.webApiPath + 'CustShipAddress',
        headers: {
            'Authorization-Token': Nuvem.GlobalSettings.tokenAuth
        },
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'total',
            successProperty: 'success',
            messageProperty: 'message',
            idProperty: 'CustShipKey'
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