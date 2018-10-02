Ext.define('Nuvem.view.vendors.EditQuoteHeaderItem', {
    extend: 'Ext.form.Panel',
    alias: 'widget.vendors.EditQuoteHeaderItem',
    // modal: true,
    // width: screen.width * 0.5,
    // height: 580,
    layout: 'column',
    title: 'Cotaçao - Produto',
    // closable: true,
    // floating: true,
    autoScroll: true,
    callerForm: null,
    currentRecord: null,
    bodyPadding: '10 0 10 0',
    activeCheckBox: null,
    header: {
        items: [
        {
            xtype: 'button',
            width: 40,
            ui: 'plain',
            style: 'color:#fff !important;',
            glyph: 0xf112,
            tooltip: 'Voltar',
            handler: function() {
                var me = this.up("form");
                me.onBackToQuotes();
            }
        }
        ]
    },
    isNewRecord: false,

    initComponent: function() {

        var me = this,
            custKey = Nuvem.GlobalSettings.getCurrentUserCustKey();

        var qHeaderKey = (me.currentRecord) ? me.currentRecord.data.QHeaderKey : 0;

        var storeItems = null;

        //var rowItemsEditingPlugin = me.loadItemsEditingPluging();

        var storeCategories = new Nuvem.store.Categories().load({
            params: {
                page: 0,
                limit: 0,
                start: 0
            }
        });

        var fieldFilters = JSON.stringify({
            fields: [
                { name: 'CustKey', value: custKey , type: 'int' }
            ]
        });

        var storeShipAddress = new Nuvem.store.CustShipAddress().load({
            params: {
                fieldFilters: fieldFilters,
                page: 0,
                start: 0,
                limit: 0
            }
        });

        var storeQuoteDetail = new Nuvem.store.QuoteDetails().load({
            params: {
                fieldFilters: JSON.stringify({
                    fields: [
                        { name: 'QHeaderKey', value: qHeaderKey , type: 'int' }
                    ]
                }),
                page: 0,
                start: 0,
                limit: 0
            }
        });

        Ext.applyIf(me, {
            fieldDefaults: {
                labelAlign: 'top',
                labelWidth: 60,
                msgTarget: 'side'
            },
            // Tab Panel
            items: [
                // Quote Information
                {
                    xtype: 'fieldset',
                    title: 'Dados Gerais',
                    margin: '0 10 10 10',
                    columnWidth: 1,
                    padding: 10,
                    layout: {
                        type: 'column'
                    },
                    items: [
                        // IMPA
                        {
                            xtype: 'textfield',
                            columnWidth: 0.20,
                            fieldLabel: 'Código IMPA',
                            name: 'QHeaderIMPA',
                            allowBlank: true,
                            readOnly: true,
                            listeners: {
                                blur: function() {
                                    //me.onSaveChangesClick();
                                }
                            }
                        },
                        // DateBegin
                        {
                            xtype: 'datefield',
                            margin: '0 0 0 5',
                            columnWidth: 0.40,
                            fieldLabel: 'Data de inicio',
                            name: 'QHeaderDateBegin',
                            allowBlank: false,
                            format: 'd/m/Y',
                            readOnly: true
                        },
                        // DateEnd
                        {
                            xtype: 'datefield',
                            margin: '0 0 0 5',
                            columnWidth: 0.40,
                            fieldLabel: 'Data de Fechamento',
                            name: 'QHeaderDateEnd',
                            allowBlank: false,
                            format: 'd/m/Y',
                            readOnly: true
                        },
                        // Endereço de Entrega
                        {
                            xtype: 'combo',
                            margin: '0 0 0 0',
                            fieldLabel: 'Endereço de Entrega',
                            columnWidth: 1,
                            name: 'CustShipKey',
                            //fieldStyle: 'font-size: 11px;',
                            displayField: 'CustShipAddress',
                            valueField: 'CustShipKey',
                            queryMode: 'remote',
                            pageSize: 8,
                            minChars: 2,
                            allowBlank: false,
                            forceSelection: false,
                            selectOnFocus: true,
                            triggerAction: '',
                            queryBy: 'ItemName',
                            queryCaching: false, // set for after add a new customer, this control recognize the new customer added
                            enableKeyEvents: true,
                            matchFieldWidth: false,
                            listConfig: {
                                width: 450
                            },
                            emptyText: 'escolher endereço',
                            store: storeShipAddress,
                            readOnly: true
                        },
                        // Data da Entrega
                        {
                            xtype: 'datefield',
                            columnWidth: 0.25,
                            fieldLabel: 'Data da Entrega',
                            name: 'QHeaderEstimatedDate',
                            allowBlank: false,
                            format: 'd/m/Y',
                            readOnly: true
                        },
                        // Categoria
                        {
                            xtype: 'combo',
                            margin: '0 0 0 5',
                            fieldLabel: 'Categoria',
                            columnWidth: 0.5,
                            name: 'CategoryKey',
                            //fieldStyle: 'font-size: 11px;',
                            displayField: 'CategoryName',
                            valueField: 'CategoryKey',
                            queryMode: 'local',
                            emptyText: 'escolher categoría',
                            selectOnFocus: true,
                            typeAhead: true,
                            minChars: 2,
                            allowBlank: false,
                            forceSelection: false,
                            listeners: {
                                beforequery: function(record) {
                                    record.query = new RegExp(record.query, 'i');
                                    record.forceAll = true;
                                },
                                blur: {
                                    fn: me.onCategoryBlur,
                                    scope: me
                                }
                            },
                            store: storeCategories,
                            readOnly: true

                        },
                        // Ordem de Compra
                        {
                            xtype: 'textfield',
                            margin: '0 0 0 5',
                            columnWidth: 0.25,
                            fieldLabel: 'Ordem de Compra',
                            name: 'QHeaderOC',
                            allowBlank: false,
                            readOnly: true
                        },
                        // Regiões dos Fornecedores 
                        {
                            xtype: 'fieldset',
                            margin: '10 0 0 0',
                            columnWidth: 0.5,
                            title: 'Fornecedores',
                            layout: 'column',
                            padding: '10 10 18 10',
                            defaultType: 'checkboxfield',
                            items: [{
                                boxLabel: 'Brasil',
                                name: 'QHeaderBrasil',
                                inputValue: '0',
                                handler: me.onChangeRegion,
                                columnWidth: 0.25,
                                readOnly: true
                            }, {
                                boxLabel: 'Região Sudeste',
                                name: 'QHeaderSudeste',
                                inputValue: '1',
                                handler: me.onChangeRegion,
                                columnWidth: 0.25,
                                readOnly: true
                            }, {
                                boxLabel: 'Região Sul',
                                name: 'QHeaderSul',
                                inputValue: '2',
                                handler: me.onChangeRegion,
                                columnWidth: 0.25,
                                readOnly: true
                            }, {
                                boxLabel: 'Região Nordeste',
                                name: 'QHeaderNordeste',
                                inputValue: '3',
                                handler: me.onChangeRegion,
                                columnWidth: 0.25,
                                readOnly: true
                            }, {
                                boxLabel: 'Região Norte',
                                name: 'QHeaderNorte',
                                inputValue: '4',
                                handler: me.onChangeRegion,
                                columnWidth: 0.25,
                                readOnly: true
                            }, {
                                boxLabel: 'Região Centro-Oeste',
                                name: 'QHeaderCentroOeste',
                                inputValue: '5',
                                handler: me.onChangeRegion,
                                columnWidth: 0.25,
                                readOnly: true
                            }]
                        },
                        // Observações
                        {
                            xtype: 'fieldset',
                            title: 'Observações',
                            columnWidth: 0.5,
                            margin: '10 0 0 5',
                            layout: 'fit',
                            padding: 6,
                            items: [{
                                xtype: 'textareafield',
                                margin: '0 0 0 5',
                                rows: 3,
                                //fieldLabel: 'Observações',
                                name: 'QHeaderComments',
                                allowBlank: true,
                                readOnly: true
                            }]
                        },
                    ]
                },
                // Grid Quote Details
                {
                    margin: '10 10 10 10',
                    title: 'Produtos',
                    xtype: 'gridpanel',
                    itemId: 'gridQuoteDetails',
                    store: storeQuoteDetail,
                    //title: 'Detail',
                    columnWidth: 1,
                    minHeight: parseInt(screen.height * 0.20),
                    maxHeight: parseInt(screen.height * 0.20),
                    features: [{
                        ftype: 'summary'
                    }],
                    columns: [{
                        xtype: 'rownumberer',
                        width: 30
                    }, {
                        xtype: 'numbercolumn',
                        width: 90,
                        dataIndex: 'QDetailQty',
                        text: 'Quantidade',
                        align: 'right',
                        //summaryType: 'sum'
                        editor: {
                            xtype: 'numericfield',
                            columnWidth: 0.2,
                            name: 'QDetailQty',
                            //fieldLabel: 'Quantidade',
                            //fieldStyle: 'text-align: right;',
                            minValue: 1,
                            hideTrigger: false,
                            useThousandSeparator: true,
                            decimalPrecision: 0,
                            alwaysDisplayDecimals: true,
                            allowNegative: false,
                            alwaysDecimals: false,
                            thousandSeparator: ','
                        }
                    }, {
                        xtype: 'gridcolumn',
                        flex: 1,
                        dataIndex: 'ItemName',
                        text: 'Produto',
                        editor: {
                            xtype: 'combo',
                            //fieldLabel: 'Produto',
                            name: 'ItemKey',
                            displayField: 'ItemName',
                            valueField: 'ItemKey',
                            queryMode: 'remote',
                            pageSize: 8,
                            minChars: 2,
                            allowBlank: true,
                            forceSelection: false,
                            selectOnFocus: true,
                            triggerAction: '',
                            queryBy: 'ItemName',
                            queryCaching: false,
                            enableKeyEvents: true,
                            emptyText: 'escolher produto',
                            listeners: {
                                buffer: 100,
                                blur: {
                                    fn: me.onItemBlur,
                                    scope: me
                                }
                            },
                            store: storeItems
                        }
                    }/*, {
                        xtype: 'actioncolumn',
                        width: 30,
                        items: [{
                            tooltip: 'Editar',
                            handler: me.onClickEditActionColumn,
                            getGlyph: function(itemScope, rowIdx, colIdx, item, rec) {
                                return 'xf040@FontAwesome';
                            }
                        }]
                    }, {
                        xtype: 'actioncolumn',
                        width: 30,
                        items: [{
                            handler: me.onClickDeleteColumn,
                            scope: me,
                            //iconCls: 'app-page-delete',
                            tooltip: 'Excluir',
                            getGlyph: function(itemScope, rowIdx, colIdx, item, rec) {
                                return 'xf014@FontAwesome';
                            }
                        }]
                    }*/],
                    selType: 'rowmodel',
                    //plugins: [rowItemsEditingPlugin],
                    // Grid Detail Toolbar
                    tbar: [/*{
                        xtype: 'searchfield',
                        width: '30%',
                        itemId: 'searchfield',
                        name: 'searchField',
                        listeners: {
                            'triggerclick': function(field) {
                                me.onSearchFieldDetailChange();
                            }
                        }
                    }, */
                    {
                        xtype: 'component',
                        flex: 1
                    }, {
                        itemId: 'addline',
                        xtype: 'button',
                        text: 'Adicionar',
                        tooltip: 'Adi (Ins)',
                        hidden: true,
                        disabled: me.currentRecord.data.isFinished,
                        handler: function() {
                            var me = this.up('form');
                            if(me.currentRecord.phantom) {
                                me.onSaveHeaderOnly(me.onClickAddline);
                            } else {
                                me.onClickAddline();
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
                    }, /*{
                        xtype: 'button',
                        itemId: 'btnSave',
                        glyph: 0xf0c7,
                        width: 90,
                        text: 'Cotar',
                        listeners: {
                            click: {
                                fn: me.onSaveChanges,
                                scope: me
                            }
                        }
                    }, {
                        xtype: 'button',
                        glyph: 0xf017,
                        width: 90,
                        itemId: 'btnSaveDraft',
                        text: 'Rascunho',
                        listeners: {
                            click: {
                                fn: me.onSaveChanges,
                                scope: me
                            }
                        }
                    },*/ {
                        xtype: 'button',
                        glyph: 0xf112,
                        width: 90,
                        itemId: 'btnCancel',
                        text: 'Voltar',
                        listeners: {
                            click: {
                                fn: me.onBackToQuotes,
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
        this.down('field[name=QHeaderIMPA]').focus(true, 200);
    },

    onSaveHeaderOnly: function(callback) {
        var me = this,
            form = me.getForm();

        if (!form.isValid()) {
            Ext.Msg.alert("Validação", "Verifique os dados. Você deve completar os dados obrigatórios");
            return;
        }

        form.updateRecord();

        record = form.getRecord();
        record.data.QHeaderDraft = true;

        record.getProxy().setSilentMode(true);

        record.save({
            success: function(record, operation) {
                callback();
            },
            failure: function() {
                // Ext.Msg.hide();
            }
        });
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

        if(button.itemId === "btnSaveDraft") {
            record.data.QHeaderDraft = true;
        }

        Ext.Msg.wait('Guardar dados...', 'Aguarde');

        record.save({
            success: function(record, operation) {
                Ext.Msg.hide();
                var form = me.callerForm,
                    grid = form.down('#gridMain');

                me.destroy();

                grid.store.reload({
                    callback: function() {
                        Ext.Msg.hide();
                    }
                });

            },
            failure: function() {
                Ext.Msg.hide();
            }
        });
    },

    loadItemsEditingPluging: function() {
        var me = this;

        // Configuramos el plugin de edición
        return new Ext.grid.plugin.RowEditing({
            clicksToMoveEditor: 2,
            autoCancel: false,
            errorSummary: false,
            customButtonsEnabled: true,
            customButtons: [
                {
                    cls: 'mybutton',
                    text: 'Novo Produto',
                    iconCls: 'fa fa-plus',
                    parentForm: me,
                    handler: function(button, eOpts) {
                        button.parentForm.onAddItem();
                    }
                }
            ],
            listeners: {
                beforeedit: {
                    delay: 100,
                    fn: function(rowEditing, context, eOpts) {
                        var me = rowEditing.editor.up("form");
                        this.getEditor().onFieldChange();

                        me.getEl().mask("Carregando...");

                         var fieldFilters = JSON.stringify({
                            fields: [
                                { name: 'ItemType', value: 0 , type: 'int' }
                            ]
                        });

                        var params = {
                            page: 1,
                            limit: 8,
                            start: 0,
                            fieldFilters: fieldFilters
                        }; 

                        if(!context.record.phantom)
                            params.id = context.record.data.ItemKey;

                        var storeItems = new Nuvem.store.Items().load({
                            params: params,
                            callback: function() {
                                var itemField = rowEditing.editor.down('field[name=ItemKey]');

                                itemField.bindStore(this);
                                itemField.setValue(params.id);

                                me.getEl().unmask();

                                rowEditing.editor.down('field[name=QDetailQty]').focus(true, 200);    
                            }
                        });
                            
                        //}, 200);
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

                        //if (record.data.POrderType === 'PB' || record.data.POrderType === 'PP' || record.data.POrderType === 'IC') {
                        // if (Ext.Array.contains(['PB', 'PP', 'IC', 'PN', 'CN'], record.data.POrderType)) {
                        //     record.data.POrderAmount = Math.abs(record.data.POrderAmount) * -1;
                        //     record.data.POrderAmountNB = Math.abs(record.data.POrderAmountNB) * -1;
                        // }

                        record.save({
                            callback: function() {
                                grid.store.reload({
                                    callback: function() {
                                        if (fromEdit && isPhantom)
                                            grid.up('panel').down("#addline").fireHandler();

                                        //grid.up('form').recalcTotals();
                                    }
                                });
                            }
                        });
                    }
                }
            }
        });
    },

    onClickAddline: function() {
        var me = this,
            grid = me.down("gridpanel");


        grid.editingPlugin.cancelEdit();

        record = new Nuvem.model.QuoteDetails({
            QHeaderKey: me.currentRecord.data.QHeaderKey,
            QDetailQty: 1
        });

        var count = parseFloat(grid.store.getCount());

        grid.store.insert(count, record);
        grid.editingPlugin.startEdit(record, 1);
        //grid.editingPlugin.editor.down('field[name=QDetailQty]').focus(true, 200);

        // var callerForm = this.up('form');

        // var vp = this.up('app_viewport');

        // vp.getEl().mask("Carregando...");

        // var storeItems = new Nuvem.store.Items().load({
        //     params: {
        //         page: 1,
        //         start: 0,
        //         limit: 8
        //     },
        //     callback: function() {
        //         var form = new Nuvem.view.purchasers.EditQuoteDetail();
        //         form.down('field[name=ItemKey]').bindStore(storeItems);
        //         form.loadRecord(record);
        //         form.center();
        //         form.callerForm = callerForm;
        //         form.show();
        //         vp.getEl().unmask();
        //     }
        // });
    },

    onChangeRegion: function(field, newValue) {
        //if (document.activeElement.name !== field.name) return;
        var me = field.up("form");

        if (me.activeCheckBox && me.activeCheckBox !== field.name) return;

        me.activeCheckBox = field.name;

        if (field.name !== 'QHeaderBrasil' && !newValue) {
            me.down('field[name=QHeaderBrasil]').setValue(false);
        }

        if (field.name === 'QHeaderBrasil' && me.activeCheckBox === field.name) {
            me.down('field[name=QHeaderSudeste]').setValue(newValue);
            me.down('field[name=QHeaderSul]').setValue(newValue);
            me.down('field[name=QHeaderNordeste]').setValue(newValue);
            me.down('field[name=QHeaderNorte]').setValue(newValue);
            me.down('field[name=QHeaderCentroOeste]').setValue(newValue);
        }

        if (field.name !== 'QHeaderBrasil' && newValue) {
            if (me.down('field[name=QHeaderSudeste]').getValue() &&
                me.down('field[name=QHeaderSul]').getValue() &&
                me.down('field[name=QHeaderNordeste]').getValue() &&
                me.down('field[name=QHeaderNorte]').getValue() &&
                me.down('field[name=QHeaderCentroOeste]').getValue())
                me.down('field[name=QHeaderBrasil]').setValue(true);
        }

        me.activeCheckBox = null;
    },

    onAddItem: function() {
        var me = this;

        var model = new Nuvem.model.Items({

        });

        var form = Ext.widget('purchasers.EditItem', {
            frameHeader: true,
            header: true,
            title: 'Novo Produto',
            closable: true,
            floating: true,
            callerForm: me,
            currentRecord: model,
            calledFromQuotes: true
        });

        form.loadRecord(model);
        form.center();
        form.show();
    },

    onCategoryBlur: function(field, The, eOpts) {
        if (field.readOnly) return;

        if(field.valueModels !== null) return;

        var me = field.up('panel'),
            rawvalue = field.getRawValue();

        if (!String.isNullOrEmpty(rawvalue)) {
            Ext.Msg.show({
                title: 'Pergunta',
                msg: 'A categoria não existe, Você deseja adicionar ao banco de dados?',
                buttons: Ext.Msg.YESNO,
                icon: Ext.Msg.QUESTION,
                fn: function(e) {
                    if (e === "yes") {
                        me.addCategory(rawvalue);
                    } else {
                        field.setValue(null);
                        field.focus(true, 200);
                    }
                }
            });
        }
    },

    addCategory: function(value) {
        var me = this,
            field = me.down('field[name=CategoryKey]'),
            storeCategories = field.store;

        var record = new Nuvem.model.Categories({
            CategoryName: value
        });

        me.getEl().mask("Aguarde...");

        record.save({
            success: function(record, operation) {
                field.store.reload({
                    callback: function() {
                        field.setValue(record.data.CategoryKey);
                        me.getEl().unmask();
                        field.focus(200, true);
                    }
                });
            },
            failure: function() {
                me.getEl().unmask();
            }
        });
    },

    onBackToQuotes: function() {
        var me = this;
        var vp = me.up('app_viewport');
        var panel = vp.down('#app_ContentPanel');
        panel.remove(me);
        me.destroy();
        Ext.Router.redirect('!purchasers');
        
        /*var vp  = this.up('app_viewport');
        var that = this;
        var formQuotes = that.callerForm;
        var panel = vp.down('#app_ContentPanel');
        var grid = formQuotes.down('#gridMain');

        formQuotes.down('#pagingtoolbar').doRefresh(function() {
            this.lastOptions.callback = null;
        });

        panel.remove(that);

        that.destroy();

        formQuotes.show();
        formQuotes.getEl().slideIn('l', {
            easing: 'backOut',
            duration: 1000
        });*/
    },

    onClickDeleteColumn: function(view, rowIndex, colIndex, item, e, record) {
        var me = this;

        var grid = me.down('gridpanel');

        Ext.Msg.show({
            title: 'Excluir',
            msg: 'Você quer deletar?',
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.QUESTION,
            fn: function(btn) {
                if (btn === "yes") {
                    record.destroy();
                }
            }
        });
    },

    onClickEditActionColumn: function(view, rowIndex, colIndex, item, e, record) {
        var me = this.up('panel');
        me.editingPlugin.startEdit(record, 1);
        //me.editingPlugin.editor.down('field[name=POrderDate]').focus(true, 200);
    }
});