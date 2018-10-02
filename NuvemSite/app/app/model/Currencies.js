Ext.define('Nuvem.model.Currencies', {
    extend: 'Ext.data.Model',
    autoLoad: false,

    fields: [
        { name:'CurrencyCode', type:'string' },
        { name:'CurrencySymbol', type:'string' },
        { name:'CurrencyName', type:'string' },
        { name:'CurrencyNativeSymbol', type:'string', useNull: true, defaultValue: null },
        { name:'CurrencyDecimalDigits', type:'int', defaultValue: null },
        { name:'CurrencyRounding', type:'int', defaultValue: null },
        { name:'CurrencyPluralName', type:'string', useNull: true, defaultValue: null }
    ],

    proxy:{
        type:'rest',
        url: Nuvem.GlobalSettings.webApiPath + 'Currencies',
        headers: {
           'Authorization-Token': Nuvem.GlobalSettings.tokenAuth
        },
        reader:{
            type:'json',
            root:'data',
            totalProperty: 'total',
            successProperty: 'success',
            messageProperty: 'message',
            idProperty: 'CurrencyRateKey'
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