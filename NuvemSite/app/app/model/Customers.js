Ext.define('Nuvem.model.Customers', {
    extend: 'Ext.data.Model',
    autoLoad: false,
    idProperty: 'CustKey',
    
    fields: [
        { name:'CustKey', type:'int', defaultValue: null },
        { name:'CustName', type:'string' },
        { name:'CustEmail', type:'string', useNull: true, defaultValue: null },
        { name:'CustCompanyName', type:'string', useNull: true, defaultValue: null },
        { name:'CustComercialName', type:'string', useNull: true, defaultValue: null },
        { name:'CustCNPJ', type:'string', useNull: true, defaultValue: null },
        { name:'CustIE', type:'string', useNull: true, defaultValue: null },
        { name:'CustIM', type:'string', useNull: true, defaultValue: null },
        { name:'CustAddress', type:'string', useNull: true, defaultValue: null },
        { name:'CustNeighborhood', type:'string', useNull: true, defaultValue: null },
        { name:'CityKey', type:'int', useNull: true, defaultValue: null },
        { name:'StateKey', type:'int', useNull:true, defaultValue: null },
        { name:'CustPhone1', type:'string', useNull: true, defaultValue: null },
        { name:'CustPhone2', type:'string', useNull: true, defaultValue: null },
        { name:'CustCreatedByUserKey', type:'int', defaultValue: Nuvem.GlobalSettings.getCurrentUserKey() },
        { name:'CustCreatedDate', type:'date', defaultValue: null },
        { name:'CustModifiedByUserKey', type:'int', useNull: true, defaultValue: null },
        { name:'CustModifiedDate', type:'date', useNull: true, defaultValue: null },
        { name:'CityName', type:'string' },
        { name:'RegionName', type:'string' },
        { name:'StateName', type:'string' },
        { name:'RegionKey', type:'int', useNull:true, defaultValue: null }
    ],

    proxy: {
        type: 'rest',
        url: Nuvem.GlobalSettings.webApiPath + 'Customers',
        headers: {
            'Authorization-Token': Nuvem.GlobalSettings.tokenAuth
        },
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'total',
            successProperty: 'success',
            messageProperty: 'message',
            idProperty: 'CustKey'
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