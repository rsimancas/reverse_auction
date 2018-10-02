Ext.define('Nuvem.view.vendors.EditVendorInfo', {
    extend: 'Ext.form.Panel',
    alias: 'widget.vendors.EditVendorInfo',
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

        var rowEditingPlugin = me.loadEditingPluging();

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
                { name: 'VendorKey', value: me.currentRecord.data.VendorKey, type: 'int' }
            ]
        });


        Ext.Msg.wait('Carregando dados', 'Aguarde');
        var storeShipAddress = me.currentRecord.data.VendorKey ? new Nuvem.store.VendorShipAddress().load({
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

        var storeVendorCategories = new Nuvem.store.VendorCategories().load({
            params: {
                fieldFilters: fieldFilters,
                page: 0,
                limit: 0,
                start: 0
            }
        });

        var storeCategories = new Nuvem.store.Categories().load({
            params: {
                page: 0,
                limit: 0,
                start: 0
            }
        });

        Ext.applyIf(me, {
            fieldDefaults: {
                labelAlign: 'top',
                labelWidth: 60,
                msgTarget: 'side',
            },
            items: [
                // tab panel
                {
                    xtype: 'tabpanel',
                    columnWidth: 1,
                    height: 400,
                    items: [
                        // Vendor Information Panel
                        {
                            padding: '0 10 10 10',
                            title: 'Dados Gerãis',
                            layout: 'column',
                            items: [{
                                xtype: 'fieldcontainer',
                                columnWidth: 1,
                                layout: 'column',
                                items: [
                                    // Razão Social
                                    {
                                        xtype: 'textfield',
                                        columnWidth: 1,
                                        fieldLabel: 'Razão Social',
                                        name: 'VendorCompanyName'
                                    },
                                    // Nome Fantasia
                                    {
                                        xtype: 'textfield',
                                        columnWidth: 1,
                                        fieldLabel: 'Nome Fantasia',
                                        name: 'VendorComercialName'
                                    },
                                    //Email
                                    {
                                        xtype: 'textfield',
                                        columnWidth: 1,
                                        margin: '0 0 0 0',
                                        fieldLabel: 'E-mail',
                                        name: 'VendorEmail',
                                        vtype: 'email',
                                        allowBlank: false
                                    },
                                    // CNPJ
                                    {
                                        xtype: 'textfield',
                                        columnWidth: 0.4,
                                        fieldLabel: 'CNPJ',
                                        name: 'VendorCNPJ'
                                    },
                                    //Inscrição Estadual
                                    {
                                        xtype: 'textfield',
                                        margin: '0 0 0 5',
                                        columnWidth: 0.3,
                                        fieldLabel: 'Inscrição Estadual',
                                        name: 'VendorIE'
                                    },
                                    //Inscrição Municipal
                                    {
                                        xtype: 'textfield',
                                        margin: '0 0 0 5',
                                        columnWidth: 0.3,
                                        fieldLabel: 'Inscrição Municipal',
                                        name: 'VendorIM'
                                    },
                                    //Endereço
                                    {
                                        xtype: 'textfield',
                                        columnWidth: 1,
                                        fieldLabel: 'Endereço',
                                        name: 'VendorAddress'
                                    },
                                    //Bairro
                                    {
                                        xtype: 'textfield',
                                        columnWidth: 0.4,
                                        fieldLabel: 'Bairro',
                                        name: 'VendorNeighborhood'
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
                                        name: 'VendorPhone1'
                                    },
                                    //Telefone #2 
                                    {
                                        xtype: 'textfield',
                                        margin: '0 0 0 5',
                                        columnWidth: 0.5,
                                        fieldLabel: 'Telefone #2',
                                        name: 'VendorPhone2'
                                    }
                                ]
                            }]
                        },
                        // Ship Address Panel
                        {
                            padding: '5 10 10 10',
                            title: 'Endereços de Entrega',
                            glyph: 0xf041,
                            layout: 'column',
                            items: [{
                                xtype: 'gridpanel',
                                columnWidth: 1,
                                itemId: 'gridshipaddress',
                                minHeight: 200,
                                columns: [{
                                    xtype: 'rownumberer',
                                    format: '00,000'
                                }, {
                                    xtype: 'checkcolumn',
                                    text: 'Default',
                                    dataIndex: 'VendorShipDefault',
                                    width: 60,
                                    readOnly: true
                                }, {
                                    xtype: 'gridcolumn',
                                    text: 'Endereço',
                                    flex: 1,
                                    dataIndex: 'VendorShipAddress'
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
                                                //var record = grid.getStore().getAt(rowIndex);
                                                var form = new Nuvem.view.vendors.EditVendorShipAddress({
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
                                                var form = new Nuvem.view.vendors.EditVendorShipAddress({
                                                    currentRecord: record
                                                });
                                                form.loadRecord(record);
                                                form.callerForm = this.up('form');
                                                form.show();
                                            },
                                            iconCls: 'fa fa-pencil',
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
                                        record = Ext.create('Nuvem.model.VendorShipAddress', {
                                            VendorKey: currentRecord.data.VendorKey
                                        });
                                        var form = new Nuvem.view.vendors.EditVendorShipAddress({
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
                                        var form = new Nuvem.view.vendors.EditVendorShipAddress({
                                            currentRecord: record
                                        });
                                        form.loadRecord(record);
                                        form.callerForm = this.up('form');
                                        form.show();
                                    }
                                }
                            }]
                        },
                        // Categories Panel
                        {
                            padding: '0 10 10 10',
                            title: 'Categorias',
                            layout: 'column',
                            items: [{
                                xtype: 'gridpanel',
                                columnWidth: 1,
                                itemId: 'gridcategories',
                                minHeight: 200,
                                maxHeight: 400,
                                store: storeVendorCategories,
                                columns: [{
                                    xtype: 'rownumberer',
                                    width: 80,
                                    text: '#',
                                    format: '00,000',
                                    align: 'left'
                                }, {
                                    xtype: 'numbercolumn',
                                    width: 120,
                                    dataIndex: 'VendorCategoryKey',
                                    text: 'ID',
                                    align: 'left',
                                    format: '00,000'
                                }, {
                                    xtype: 'gridcolumn',
                                    text: 'Categoria',
                                    flex: 1,
                                    dataIndex: 'CategoryName',
                                    editor: {
                                        xtype: 'combo',
                                        name: 'CategoryKey',
                                        displayField: 'CategoryName',
                                        valueField: 'CategoryKey',
                                        queryMode: 'local',
                                        //typeAhead: true,
                                        minChars: 2,
                                        forceSelection: true,
                                        emptyText: 'escolher categoria',
                                        allowBlank: false,
                                        listeners: {
                                            beforequery: function(queryPlan) {
                                                queryPlan.query = new RegExp(queryPlan.query, "ig");
                                                queryPlan.forceAll = true;
                                            },
                                            select: function(combo, records, eOpts) {
                                                var rowEditForm = combo.up('form'),
                                                    contextRecord = rowEditForm.context.record;

                                                contextRecord.set('CategoryName', records[0].data.CategoryName);
                                                rowEditForm.editingPlugin.editor.onFieldChange();
                                            }
                                        },
                                        store: storeCategories
                                    }
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
                                            var me = this.up('panel');
                                            me.editingPlugin.startEdit(record, 1);
                                        },
                                        tooltip: 'Atualizar Registro',
                                        getGlyph: function(itemScope, rowIdx, colIdx, item, rec) {
                                            return 'xf040@FontAwesome';
                                        }
                                    }]
                                }],
                                tbar: [{
                                    xtype: 'component',
                                    flex: 1
                                }, {
                                    text: 'Add',
                                    itemId: 'addcategory',
                                    handler: function() {
                                        var me = this.up("form"),
                                            grid = me.down("#gridcategories"),
                                            user = Nuvem.GlobalSettings.currentUser;


                                        grid.editingPlugin.cancelEdit();

                                        record = new Nuvem.model.VendorCategories({
                                            VendorKey: user.VendorKey
                                        });

                                        var count = parseFloat(grid.store.getCount());

                                        grid.store.insert(count, record);
                                        grid.editingPlugin.startEdit(record, 1);
                                    }
                                }, {
                                    itemId: 'deletecategory',
                                    text: 'Excluir',
                                    handler: function() {
                                        var me = this.up("form"),
                                            grid = me.down("#gridcategories"),
                                            sm = grid.getSelectionModel();

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
                                plugins: [rowEditingPlugin],
                                listeners: {
                                    selectionchange: function(view, records) {
                                        this.down('#deletecategory').setDisabled(!records.length);
                                    }
                                }
                            }]
                        },
                        // Regiões
                        {
                            padding: '0 10 10 10',
                            title: 'Regiões',
                            layout: 'column',
                            items: [
                                // Seleção
                                // Regiões dos Fornecedores 
                                {
                                    xtype: 'fieldset',
                                    margin: '10 0 0 0',
                                    columnWidth: 1,
                                    title: 'Fornecedores',
                                    layout: 'column',
                                    padding: '10 10 22 10',
                                    defaultType: 'checkboxfield',
                                    items: [{
                                        boxLabel: 'Brasil',
                                        name: 'VendorBrasil',
                                        inputValue: '0',
                                        handler: me.onChangeRegion,
                                        columnWidth: 0.25
                                    }, {
                                        boxLabel: 'Região Sudeste',
                                        name: 'VendorSudeste',
                                        inputValue: '1',
                                        handler: me.onChangeRegion,
                                        columnWidth: 0.25
                                    }, {
                                        boxLabel: 'Região Sul',
                                        name: 'VendorSul',
                                        inputValue: '2',
                                        handler: me.onChangeRegion,
                                        columnWidth: 0.25
                                    }, {
                                        boxLabel: 'Região Nordeste',
                                        name: 'VendorNordeste',
                                        inputValue: '3',
                                        handler: me.onChangeRegion,
                                        columnWidth: 0.25
                                    }, {
                                        boxLabel: 'Região Norte',
                                        name: 'VendorNorte',
                                        inputValue: '4',
                                        handler: me.onChangeRegion,
                                        columnWidth: 0.25
                                    }, {
                                        boxLabel: 'Região Centro-Oeste',
                                        name: 'VendorCentroOeste',
                                        inputValue: '5',
                                        handler: me.onChangeRegion,
                                        columnWidth: 0.25
                                    }]
                                }
                            ]
                        }
                    ]
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
        this.down('field[name=VendorCompanyName]').focus(true, 200);
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
    },

    loadEditingPluging: function() {
        var me = this;

        // Configuramos el plugin de edición
        return new Ext.grid.plugin.RowEditing({
            clicksToMoveEditor: 2,
            autoCancel: false,
            errorSummary: false,
            listeners: {
                beforeedit: {
                    delay: 100,
                    fn: function(rowEditing, context, eOpts) {
                        var me = rowEditing.editor.up("form");
                        this.getEditor().onFieldChange();
                    }
                },
                cancelEdit: {
                    fn: function(rowEditing, context) {
                        var grid = this.editor.up("gridpanel");
                        // Canceling editing of a locally added, unsaved record: remove it
                        if (context.record.phantom) {
                            grid.store.remove(context.record);
                            //grid.up('form').recalcTotals();
                        }
                    }
                },
                edit: {
                    fn: function(editor, context) {
                        var grid = this.editor.up('gridpanel'),
                            record = context.record,
                            fromEdit = true,
                            isPhantom = record.phantom;


                        record.save({
                            callback: function() {
                                grid.store.reload({
                                    callback: function() {
                                        if (fromEdit && isPhantom)
                                            grid.up('panel').down("#addcategory").fireHandler();
                                    }
                                });
                            }
                        });
                    }
                }
            }
        });
    },

    onChangeRegion: function(field, newValue) {
        //if (document.activeElement.name !== field.name) return;
        var me = field.up("form");

        if (me.activeCheckBox && me.activeCheckBox !== field.name) return;

        me.activeCheckBox = field.name;

        if (field.name !== 'VendorBrasil' && !newValue) {
            me.down('field[name=VendorBrasil]').setValue(false);
        }

        if (field.name === 'VendorBrasil' && me.activeCheckBox === field.name) {
            me.down('field[name=VendorSudeste]').setValue(newValue);
            me.down('field[name=VendorSul]').setValue(newValue);
            me.down('field[name=VendorNordeste]').setValue(newValue);
            me.down('field[name=VendorNorte]').setValue(newValue);
            me.down('field[name=VendorCentroOeste]').setValue(newValue);
        }

        if (field.name !== 'VendorBrasil' && newValue) {
            if (me.down('field[name=VendorSudeste]').getValue() &&
                me.down('field[name=VendorSul]').getValue() &&
                me.down('field[name=VendorNordeste]').getValue() &&
                me.down('field[name=VendorNorte]').getValue() &&
                me.down('field[name=VendorCentroOeste]').getValue())
                me.down('field[name=VendorBrasil]').setValue(true);
        }

        me.activeCheckBox = null;
    }

});
