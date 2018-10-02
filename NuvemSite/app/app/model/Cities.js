Ext.define('Nuvem.model.Cities', {
    extend: 'Ext.data.Model',
    autoLoad: false,
    idProperty: 'CityKey',
    
    fields: [
        { name:'CityKey', type:'int', defaultValue: null },
        { name:'CityName', type:'string' },
        { name:'StateKey', type:'int', defaultValue: null },
        { name:'CountryKey', type:'int', defaultValue: null },
        { name:'CountryName', type:'string' },
        { name:'RegionKey', type:'int', defaultValue: null },
        { name:'RegionName', type:'string' },
        { name:'StateName', type:'string' },
        { name:'StateUF', type:'string' }
    ],

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
            messageProperty: 'message',
            idProperty: 'CityKey'
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