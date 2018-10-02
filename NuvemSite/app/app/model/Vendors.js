Ext.define('Nuvem.model.Vendors', {
    extend: 'Ext.data.Model',
    idProperty: 'VendorKey',
    autoLoad: false,

    fields: [
        { name:'VendorKey', type:'int', defaultValue: null },
        { name:'VendorName', type:'string' },
        { name:'VendorEmail', type:'string', useNull: true, defaultValue: null },
        { name:'VendorCompanyName', type:'string', useNull: true, defaultValue: null },
        { name:'VendorComercialName', type:'string', useNull: true, defaultValue: null },
        { name:'VendorCNPJ', type:'string', useNull: true, defaultValue: null },
        { name:'VendorIE', type:'string', useNull: true, defaultValue: null },
        { name:'VendorIM', type:'string', useNull: true, defaultValue: null },
        { name:'VendorAddress', type:'string', useNull: true, defaultValue: null },
        { name:'VendorNeighborhood', type:'string', useNull: true, defaultValue: null },
        { name:'CityKey', type:'int', useNull: true, defaultValue: null },
        { name:'StateKey', type:'int', useNull:true, defaultValue: null },
        { name:'VendorPhone1', type:'string', useNull: true, defaultValue: null },
        { name:'VendorPhone2', type:'string', useNull: true, defaultValue: null },
        { name:'VendorCreatedByUserKey', type:'int', defaultValue: Nuvem.GlobalSettings.getCurrentUserKey() },
        { name:'VendorCreatedDate', type:'date', defaultValue: null },
        { name:'VendorModifiedByUserKey', type:'int', useNull: true, defaultValue: null },
        { name:'VendorModifiedDate', type:'date', useNull: true, defaultValue: null },
        { name:'VendorBrasil', type:'boolean', defaultValue: null },
        { name:'VendorSudeste', type:'boolean', defaultValue: null },
        { name:'VendorSul', type:'boolean', defaultValue: null },
        { name:'VendorNordeste', type:'boolean', defaultValue: null },
        { name:'VendorNorte', type:'boolean', defaultValue: null },
        { name:'VendorCentroOeste', type:'boolean', defaultValue: null },
        { name:'CityName', type:'string' },
        { name:'RegionName', type:'string' },
        { name:'StateName', type:'string' },
        { name:'RegionKey', type:'int', useNull:true, defaultValue: null }
    ],

    proxy:{
        type:'rest',
        url: Nuvem.GlobalSettings.webApiPath + 'Vendors',
        headers: {
           'Authorization-Token': Nuvem.GlobalSettings.tokenAuth
        },
        reader:{
            type:'json',
            root:'data',
            totalProperty: 'total',
            successProperty: 'success',
            messageProperty: 'message',
            idProperty: 'VendorKey'
        },
        writer: {
            writeAllFields: false
        },
        afterRequest: function (request, success) {
            var silentMode = this.getSilentMode();

            if (request.action == 'read') {
                //this.readCallback(request);
            }
            else if (request.action == 'create') {
                if (!request.operation.success)
                {
                    Ext.popupMsg.msg("Aviso", "O registo n&#227;o foi salvo com &#234;xito");
                    Ext.global.console.warn(request.proxy.reader.jsonData.message);
                } else {
                    if(!silentMode)
                    Ext.popupMsg.msg("Sucesso","Registro atualizado com &#234;xito");
                }
            }
            else if (request.action == 'update') {
                if (!request.operation.success)
                {
                    Ext.popupMsg.msg("Aviso", "O registo n&#227;o foi salvo com &#234;xito");
                    Ext.global.console.warn(request.proxy.reader.jsonData.message);
                } else {
                    if(!silentMode)
                    Ext.popupMsg.msg("Sucesso","Registro atualizado com &#234;xito");
                }
            }
            else if (request.action == 'destroy') {
                if (!request.operation.success)
                {
                    Ext.popupMsg.msg("Aviso", "O registo n&#227;o foi exclu&#237;do com &#234;xito");
                    //Ext.global.console.warn(request.proxy.reader.jsonData.message);
                } else {
                    if(!silentMode)
                    Ext.popupMsg.msg("Sucesso","Registro exclu&#237;do com &#234;xito");
                }
            }

            this.setSilentMode(false);
        }
    }
});