Ext.define('Nuvem.view.purchasers.EditCustInfo', {
    extend: 'Ext.form.Panel',
    alias: 'widget.purchasers.EditCustInfo',
    modal: true,
    width: 700,
    layout: 'column',
    title: 'Informações da Empresa',
    closable: true,
    floating: true,
    callerForm: null,
    currentRecord: null,
    bodyPadding: 10,
    activeCheckBox: null,
    glyph: 0xf013,

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
                { name: 'StateKey', value: me.currentRecord.data.StateKey, type: 'int' }
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

        fieldFilters = JSON.stringify({
            fields: [
                { name: 'CustKey', value: me.currentRecord.data.CustKey, type: 'int' }
            ]
        });


        Ext.Msg.wait('Carregando dados', 'Aguarde');
        var storeShipAddress = me.currentRecord.data.CustKey ? new Nuvem.store.CustShipAddress().load({
            params: {
                fieldFilters: fieldFilters,
                page: 0,
                start: 0,
                limit: 0
            },
            callback: function() {
                var grid = me.down('#gridshipaddress');
                grid.reconfigure(storeShipAddress);
                Ext.Msg.hide();
                //storeShipAddress.lastOptions.callback = null;
            }
        }) : null;

        if (storeShipAddress === null) Ext.Msg.hide();

        Ext.applyIf(me, {
            fieldDefaults: {
                labelAlign: 'top',
                labelWidth: 60,
                msgTarget: 'side'
            },
            items: [
                // Customer Information Panel
                {
                    xtype: 'fieldset',
                    columnWidth: 1,
                    padding: '0 10 10 10',
                    title: 'Dados Gerãis',
                    layout: {
                        type: 'column'
                    },
                    bodyPadding: '5 10 25 10',
                    items: [{
                        xtype: 'fieldcontainer',
                        columnWidth: 1,
                        layout: {
                            type: 'column'
                        },
                        items: [
                            // Razão Social
                            {
                                xtype: 'textfield',
                                columnWidth: 1,
                                fieldLabel: 'Razão Social',
                                name: 'CustCompanyName'
                            },
                            // Nome Fantasia
                            {
                                xtype: 'textfield',
                                columnWidth: 1,
                                fieldLabel: 'Nome Fantasia',
                                name: 'CustComercialName'
                            },
                            //Email
                            {
                                xtype: 'textfield',
                                columnWidth: 1,
                                margin: '0 0 0 0',
                                fieldLabel: 'E-mail',
                                name: 'CustEmail',
                                vtype: 'email',
                                allowBlank: false
                            },
                            // CNPJ
                            {
                                xtype: 'textfield',
                                columnWidth: 0.4,
                                fieldLabel: 'CNPJ',
                                name: 'CustCNPJ'
                            },
                            //Inscrição Estadual
                            {
                                xtype: 'textfield',
                                margin: '0 0 0 5',
                                columnWidth: 0.3,
                                fieldLabel: 'Inscrição Estadual',
                                name: 'CustIE'
                            },
                            //Inscrição Municipal
                            {
                                xtype: 'textfield',
                                margin: '0 0 0 5',
                                columnWidth: 0.3,
                                fieldLabel: 'Inscrição Municipal',
                                name: 'CustIM'
                            },
                            //Endereço
                            {
                                xtype: 'textfield',
                                columnWidth: 1,
                                fieldLabel: 'Endereço',
                                name: 'CustAddress'
                            },
                            //Bairro
                            {
                                xtype: 'textfield',
                                columnWidth: 0.4,
                                fieldLabel: 'Bairro',
                                name: 'CustNeighborhood'
                            },
                            //Estado
                            {
                                xtype: 'combo',
                                margin: '0 0 0 5',
                                columnWidth: 0.3,
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
                                columnWidth: 0.3,
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
                                listeners: {
                                    beforequery: function(queryPlan) {
                                        queryPlan.query = new RegExp(queryPlan.query, "ig");
                                        queryPlan.forceAll = true;
                                    }
                                }
                            },
                            //Telefone #1
                            {
                                xtype: 'textfield',
                                columnWidth: 0.5,
                                fieldLabel: 'Telefone #1',
                                name: 'CustPhone1'
                            },
                            //Telefone #2 
                            {
                                xtype: 'textfield',
                                margin: '0 0 0 5',
                                columnWidth: 0.5,
                                fieldLabel: 'Telefone #2',
                                name: 'CustPhone2'
                            }
                        ]
                    }]
                },
                // Ship Address Panel
                {
                    xtype: 'fieldset',
                    columnWidth: 1,
                    margin: '0 0 0 0',
                    padding: '5 10 10 10',
                    title: 'Endereços de Entrega',
                    glyph: 0xf041,
                    items: [{
                        xtype: 'gridpanel',
                        itemId: 'gridshipaddress',
                        minHeight: 200,
                        columns: [{
                            xtype: 'rownumberer',
                            format: '00,000'
                        }, {
                            xtype: 'checkcolumn',
                            text: 'Default',
                            dataIndex: 'CustShipDefault',
                            width: 60,
                            readOnly: true
                        }, {
                            xtype: 'gridcolumn',
                            text: 'Endereço',
                            flex: 1,
                            dataIndex: 'CustShipAddress'
                        }, {
                            xtype: 'gridcolumn',
                            text: 'Cidade',
                            dataIndex: 'CityName'
                        }, {
                            xtype: 'gridcolumn',
                            text: 'Estado',
                            dataIndex: 'StateName'
                        }, {
                            xtype: 'actioncolumn',
                            draggable: false,
                            width: 35,
                            resizable: false,
                            hideable: false,
                            stopSelection: false,
                            items: [{
                                    itemId: 'actionEditAddress',
                                    handler: function(grid, rowIndex, colIndex, item, e, record, row) {
                                        var me = grid.up('form');
                                        var form = new Nuvem.view.purchasers.EditCustShipAddress({
                                            currentRecord: record
                                        });
                                        form.loadRecord(record);
                                        form.callerForm = this.up('form');
                                        form.show();
                                    },
                                    tooltip: 'Atualizar Registro',
                                    getGlyph: function(itemScope, rowIdx, colIdx, item, rec) {
                                        return 'xf040@FontAwesome';
                                    }
                                }]
                                /*items: [{
                                    handler: function(view, rowIndex, colIndex, item, e, record, row) {
                                        var form = new Nuvem.view.purchasers.EditCustShipAddress({
                                            currentRecord: record
                                        });
                                        form.loadRecord(record);
                                        form.callerForm = this.up('form');
                                        form.show();
                                    },
                                    iconCls: 'app-grid-edit',
                                    tootip: 'Atualizar Registro'
                                }]*/
                        }],
                        tbar: [{
                            xtype: 'component',
                            flex: 1
                        }, {
                            text: 'Add',
                            itemId: 'addshipaddress',
                            handler: function() {
                                currentRecord = this.up('form').getRecord();
                                record = Ext.create('Nuvem.model.CustShipAddress', {
                                    CustKey: currentRecord.data.CustKey
                                });
                                var form = new Nuvem.view.purchasers.EditCustShipAddress({
                                    currentRecord: record
                                });
                                form.loadRecord(record);
                                form.center();
                                form.callerForm = this.up('form');
                                form.show();
                            }
                        }, {
                            itemId: 'deleteshipaddress',
                            text: 'Excluir',
                            handler: function() {
                                var grid = this.up('gridpanel');
                                var sm = grid.getSelectionModel();

                                selection = sm.getSelection();

                                if (selection) {
                                    selection[0].destroy({
                                        success: function() {
                                            grid.store.remove(selection[0]);
                                            if (grid.store.getCount() > 0) {
                                                sm.select(0);
                                            }
                                        }
                                    });
                                }
                            },
                            disabled: true
                        }, ],
                        selType: 'rowmodel',
                        listeners: {
                            selectionchange: function(view, records) {
                                this.down('#deleteshipaddress').setDisabled(!records.length);
                            },
                            celldblclick: function(view, td, cellIndex, record, tr, rowIndex, e, eOpts) {
                                var form = new Nuvem.view.purchasers.EditCustShipAddress({
                                    currentRecord: record
                                });
                                form.loadRecord(record);
                                form.callerForm = this.up('form');
                                form.show();
                            }
                        }
                    }]
                }
            ],
            dockedItems: [
                // ToolBar
                {
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
                }
            ],
            listeners: {
                show: {
                    fn: me.onShowWindow,
                    scope: me
                },
                close: {
                    fn: me.onCloseForm,
                    scope: me
                }
            }
        });

        me.callParent(arguments);
    },

    onShowWindow: function() {
        this.down('field[name=CustCompanyName]').focus(true, 200);
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

        var isPhantom = record.phantom;

        Ext.Msg.wait('Guardar dados...', 'Aguarde');

        record.save({
            success: function(record, operation) {
                Ext.Msg.hide();
                me.destroy();
            },
            failure: function() {
                Ext.Msg.hide();
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
