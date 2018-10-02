Ext.define('Nuvem.model.Categories', {
    extend: 'Ext.data.Model',
    autoLoad: false,
    idProperty: 'CategoryKey',
    
    fields: [
        { name:'CategoryKey', type:'int', defaultValue: null },
        { name:'CategoryName', type:'string' },
        { name:'CategoryCreatedByUserKey', type:'int', defaultValue: Nuvem.GlobalSettings.getCurrentUserKey() },
        { name:'CategoryCreatedDate', type:'date', defaultValue: new Date() },
        { name:'CategoryModifiedByUserKey', type:'int', useNull: true, defaultValue: null },
        { name:'CategoryModifiedDate', type:'date', useNull: true, defaultValue: null }
    ],

    proxy: {
        type: 'rest',
        url: Nuvem.GlobalSettings.webApiPath + 'Categories',
        headers: {
            'Authorization-Token': Nuvem.GlobalSettings.tokenAuth
        },
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'total',
            successProperty: 'success',
            messageProperty: 'message',
            idProperty: 'CategoryKey'
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