Ext.define('Nuvem.model.QuoteChart', {
    extend: 'Ext.data.Model',
    autoLoad: false,

    fields: [
        { name:'Year', type:'int', defaultValue: 0 },
        { name:'Month', type:'string', defaultValue: "" },
        { name:'Total', type:'float', defaultValue: 0 },
        { name:'GY', type:'float', defaultValue: 0 },
        { name:'CC', type:'float', defaultValue: 0 },
        { name:'INV', type:'float', defaultValue: 0 },
        { name:'VolumeWeight', type:'float', defaultValue: 0 }
    ],

    proxy:{
        type:'rest',
        url: Nuvem.GlobalSettings.webApiPath + 'QuoteChart',
        headers: {
           'Authorization-Token': Nuvem.GlobalSettings.tokenAuth
        },
        reader:{
            type:'json',
            root:'data',
            totalProperty: 'total',
            successProperty: 'success',
            messageProperty: 'message'
        },
        afterRequest: function (request, success) {
            if (request.action == 'read') {
                //this.readCallback(request);
            }
            else if (request.action == 'create') {
                if (!request.operation.success)
                {
                    Ext.popupMsg.msg("Aviso", "O registo n&#227;o foi salvo com &#234;xito");
                    Ext.global.console.warn(request.proxy.reader.jsonData.message);
                } else {
                    Ext.popupMsg.msg("Sucesso","Registro atualizado com &#234;xito");
                }
            }
            else if (request.action == 'update') {
                if (!request.operation.success)
                {
                    Ext.popupMsg.msg("Aviso", "O registo n&#227;o foi salvo com &#234;xito");
                    Ext.global.console.warn(request.proxy.reader.jsonData.message);
                } else {
                    Ext.popupMsg.msg("Sucesso","Registro atualizado com &#234;xito");
                }
            }
            else if (request.action == 'destroy') {
                if (!request.operation.success)
                {
                    Ext.popupMsg.msg("Aviso", "O registo n&#227;o foi exclu&#237;do com &#234;xito");
                    //Ext.global.console.warn(request.proxy.reader.jsonData.message);
                } else {
                    Ext.popupMsg.msg("Sucesso","Registro exclu&#237;do com &#234;xito");
                }
            }
        }
    },


});