Ext.define('Nuvem.view.vendors.EditVendorShipAddress', {
    extend: 'Ext.form.Panel',
    alias: 'widget.EditVendorShipAddress',
    modal: true,
    width: 500,
    layout: {
        type: 'absolute'
    },
    title: 'Endereço de Entrega',
    bodyPadding: 10,
    closable: true,
    stateful: false,
    floating: true,
    callerForm: "",
    forceFit: true,
    currentRecord: null,
    glyph: 0xf041,

    initComponent: function() {

        var me = this;

        var storeStates = new Nuvem.store.States().load({
            params: {
                page: 0,
                start: 0,
                limit: 0
            }
        });

        var fieldFilters = JSON.stringify({
            fields: [
                { name: 'StateKey', value: me.currentRecord.data.StateKey, type: 'string' }
            ]
        });

        var storeCities = me.currentRecord.data.StateKey ? new Nuvem.store.Cities().load({
            params: {
                fieldFilters: fieldFilters,
                page: 0,
                start: 0,
                limit: 0
            }
        }) : null;


        Ext.applyIf(me, {
            fieldDefaults: {
                labelAlign: 'top',
                labelWidth: 60,
                msgTarget: 'side'
            },
            items: [{
                xtype: 'fieldcontainer',
                margin: '0 0 20 0',
                layout: {
                    type: 'column'
                },
                items: [{
                        xtype: 'checkbox',
                        columnWidth: 1,
                        name: 'VendorShipDefault',
                        labelSeparator: '',
                        hideLabel: true,
                        boxLabel: 'Default',
                        //fieldLabel: 'Print note below item',
                    }, {
                        xtype: 'textfield',
                        columnWidth: 1,
                        margin: '0 0 0 0',
                        fieldLabel: 'Endereço',
                        name: 'VendorShipAddress',
                        allowBlank: false
                    },
                    //Estado
                    {
                        xtype: 'combo',
                        columnWidth: 0.5,
                        fieldLabel: 'Estado',
                        name: 'StateKey',
                        displayField: 'StateName',
                        valueField: 'StateKey',
                        queryMode: 'local',
                        //typeAhead: true,
                        minChars: 2,
                        forceSelection: true,
                        store: storeStates,
                        emptyText: 'escolher estado',
                        allowBlank: false,
                        listeners: {
                            buffer: 100,
                            select: me.onSelectState,
                            beforequery: function(queryPlan) {
                                queryPlan.query = new RegExp(queryPlan.query, "ig");
                                queryPlan.forceAll = true;
                            }
                        }
                    },
                    //City
                    {
                        xtype: 'combo',
                        margin: '0 0 0 5',
                        columnWidth: 0.5,
                        fieldLabel: 'Cidade',
                        name: 'CityKey',
                        displayField: 'CityName',
                        valueField: 'CityKey',
                        queryMode: 'local',
                        //typeAhead: true,
                        minChars: 2,
                        forceSelection: true,
                        store: storeCities,
                        emptyText: 'escolher cidade',
                        allowBlank: false,
                        listeners: {
                            beforequery: function(queryPlan) {
                                queryPlan.query = new RegExp(queryPlan.query, "ig");
                                queryPlan.forceAll = true;
                            }
                        }
                    }
                ]
            }],
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'bottom',
                ui: 'footer',
                items: [{
                    xtype: 'component',
                    flex: 1
                }, {
                    xtype: 'button',
                    itemId: 'btnSave',
                    glyph: 0xf0c7,
                    width: 90,
                    text: 'Salvar',
                    listeners: {
                        click: {
                            fn: me.onSaveChanges,
                            scope: me
                        }
                    }
                }, {
                    xtype: 'button',
                    glyph: 0xf05e,
                    width: 90,
                    itemId: 'btnCancel',
                    text: 'Voltar',
                    listeners: {
                        click: {
                            fn: me.onClickCancel,
                            scope: me
                        }
                    }
                }]
            }],
            listeners: {
                show: {
                    fn: me.onShowWindow,
                    scope: me
                }
            }
        });

        me.callParent(arguments);
    },

    onShowWindow: function() {
        this.down("field[name=VendorShipAddress]").focus(true, 200);
    },

    onSaveChanges: function(button, e, eOpts) {
        var me = this,
            form = me.getForm();

        if (!form.isValid()) {
            Ext.Msg.alert("Validação", "Verifique os dados!!!");
            return;
        }

        form.updateRecord();

        record = form.getRecord();

        Ext.Msg.wait('Saving Record...', 'Wait');

        record.save({
            callback: function(records, operation, success) {
                if (success) {
                    var form = me.callerForm;
                    me.destroy();
                    var grid = form.down('#gridshipaddress');

                    fieldFilters = JSON.stringify({
                        fields: [
                            { name: 'VendorKey', value: me.currentRecord.data.VendorKey, type: 'int' }
                        ]
                    });

                    var storeAddress = new Nuvem.store.VendorShipAddress().load({
                        params: {
                            fieldFilters: fieldFilters,
                            page: 0,
                            start: 0,
                            limit: 0
                        },
                        callback: function() {
                            grid.reconfigure(storeAddress);
                            storeAddress.lastOptions.callback = null;
                            Ext.Msg.hide();
                        }
                    });
                } else {
                    Ext.Msg.hide();
                }
            }
        });
    },

    onClickCancel: function() {
        this.destroy();
    },

    onSelectState: function(field, records, eOpts) {
        var me = field.up('form');

        if (records.length === 0) return;

        var fieldCities = field.next();

        var fieldFilters = JSON.stringify({
            fields: [
                { name: 'StateKey', value: field.getValue(), type: 'string' }
            ]
        });

        me.getEl().mask('Carregando Cidades, Aguarde...');
        var storeCities = new Nuvem.store.Cities().load({
            params: {
                fieldFilters: fieldFilters,
                page: 0,
                start: 0,
                limit: 0
            },
            callback: function(records, success, eOpts) {
                fieldCities.bindStore(storeCities);
                me.getEl().unmask();
            }
        });

    }
});
