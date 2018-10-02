Ext.define('Nuvem.view.vendors.EditQuoteHeaderOffers', {
    extend: 'Ext.form.Panel',
    alias: 'widget.vendors.EditQuoteHeaderOffers',
    //modal: true,
    //width: 900,
    /*height: 580,*/
    layout: 'column',
    title: 'Orçamento',
    //closable: true,
    //floating: true,
    callerForm: null,
    currentRecord: null,
    bodyPadding: '10 0 10 0',
    activeCheckBox: null,
    currentAnswer: null,

    initComponent: function() {

        var me = this,
            vendorKey = Nuvem.GlobalSettings.getCurrentUserVendorKey();

        var qHeaderKey = (me.currentRecord) ? me.currentRecord.data.QHeaderKey : 0;

        var storeOfferDetails = null;

        Ext.applyIf(me, {
            fieldDefaults: {
                labelAlign: 'top',
                labelWidth: 60,
                msgTarget: 'side'
            },
            items: [
                // Offer
                {
                    xtype: 'fieldset',
                    title: 'Detalhe',
                    margin: '0 10 15 10',
                    columnWidth: 1,
                    padding: 10,
                    layout: 'column',
                    items: [
                        // top line
                        {
                            xtype: 'fieldcontainer',
                            layout: 'hbox',
                            columnWidth: 1,
                            items: [
                                // Data da Entrega
                                {
                                    xtype: 'datefield',
                                    fieldLabel: 'Data da Entrega',
                                    name: 'QOfferDeliveryDate',
                                    format: 'd/m/Y',
                                    value: new Date(),
                                    allowBlank: false,
                                    readOnly: me.currentRecord.data.isFinished || me.currentRecord.data.wasDesisted || me.currentRecord.data.wasCancelled
                                }, {
                                    xtype: 'component',
                                    flex: 1
                                },
                                // Valor
                                {
                                    xtype: 'numericfield',
                                    name: 'QOfferValue',
                                    fieldLabel: 'Valor',
                                    minValue: 0,
                                    hideTrigger: true,
                                    allowBlank: false,
                                    useThousandSeparator: true,
                                    decimalPrecision: 2,
                                    alwaysDisplayDecimals: true,
                                    allowNegative: false,
                                    currencySymbol: 'R$ ',
                                    alwaysDecimals: false,
                                    thousandSeparator: ',',
                                    fieldStyle: 'text-align: right; color: green; font-weight: bold;',
                                    readOnly: true
                                }
                            ]
                        },
                        // Comentarios
                        {
                            xtype: 'textareafield',
                            name: 'QOfferComments',
                            fieldLabel: 'Comentarios',
                            columnWidth: 1,
                            readOnly: me.currentRecord.data.isFinished || me.currentRecord.data.wasDesisted || me.currentRecord.data.wasCancelled
                        }, {
                            xtype: 'hiddenfield',
                            name: 'QOfferKey'
                        }
                    ]
                },
                // Grid Offer Details
                {
                    margin: '10 10 10 10',
                    title: 'Produtos',
                    xtype: 'gridpanel',
                    itemId: 'gridOfferDetails',
                    store: storeOfferDetails,
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
                            xtype: 'gridcolumn',
                            flex: 1,
                            dataIndex: 'ItemName',
                            text: 'Produto'
                        }, {
                            xtype: 'numbercolumn',
                            width: 90,
                            dataIndex: 'QOfferDetailQty',
                            text: 'Quantidade',
                            align: 'right',
                            renderer: function(value, metadata, record, rowIndex, colIndex, store) {
                                metadata.tdAttr = 'data-qtip="clique"';
                                return value;
                            },
                            editor: {
                                xtype: 'numericfield',
                                name: 'QOfferDetailQty',
                                minValue: 0,
                                hideTrigger: false,
                                useThousandSeparator: true,
                                decimalPrecision: 0,
                                alwaysDisplayDecimals: true,
                                allowNegative: false,
                                alwaysDecimals: false,
                                thousandSeparator: ',',
                                selectOnFocus: true
                            }
                        }, {
                            xtype: 'gridcolumn',
                            width: 150,
                            text: 'Preço',
                            align: 'right',
                            dataIndex: 'QOfferDetailPrice',
                            renderer: function(value, metadata, record, rowIndex, colIndex, store) {
                                var returnValue = Ext.util.Format.usMoney(value),
                                    currencySymbol = 'R$ ';

                                metadata.tdAttr = 'data-qtip="clique"';
                                return returnValue.replace('$', currencySymbol);
                            },
                            sortable: true,
                            editor: {
                                xtype: 'numericfield',
                                name: 'QOfferDetailPrice',
                                minValue: 0,
                                hideTrigger: false,
                                useThousandSeparator: true,
                                decimalPrecision: 2,
                                alwaysDisplayDecimals: true,
                                allowNegative: false,
                                alwaysDecimals: false,
                                thousandSeparator: ',',
                                selectOnFocus: true
                            }
                        }, {
                            xtype: 'gridcolumn',
                            width: 150,
                            text: 'Preço da Linha',
                            align: 'right',
                            dataIndex: 'QOfferDetailLinePrice',
                            renderer: function(value, metaData, record) {
                                var returnValue = Ext.util.Format.usMoney(value),
                                    currencySymbol = 'R$ ';
                                return returnValue.replace('$', currencySymbol);
                            },
                            summaryType: 'sum',
                            summaryRenderer: function(value, metaData, dataIndex) {
                                var currencySymbol = "R$ ",
                                    returnValue = Ext.util.Format.usMoney(value);
                                return returnValue.replace('$', currencySymbol);
                            },
                            sortable: true
                        }
                        /*, {
                                                xtype: 'actioncolumn',
                                                width: 30,
                                                items: [{
                                                    tooltip: 'Editar',
                                                    handler: me.onClickEditActionColumn,
                                                    getGlyph: function(itemScope, rowIdx, colIdx, item, rec) {
                                                        return 'xf040@FontAwesome';
                                                    }
                                                }]
                                            }*/
                    ],
                    selType: 'rowmodel',
                    plugins: (!me.currentRecord.data.isFinished && !me.currentRecord.data.wasDesisted && !me.currentRecord.data.wasCancelled)  ? new Ext.grid.plugin.CellEditing({
                        clicksToEdit: 1,
                        listeners: {
                            edit: {
                                fn: function(editor, context) {
                                    var grid = context.grid,
                                        record = context.record,
                                        fromEdit = true,
                                        isPhantom = record.phantom,
                                        me = grid.up("panel");

                                    record.set("QOfferDetailLinePrice", record.data.QOfferDetailQty * record.data.QOfferDetailPrice);

                                    me.down("field[name=QOfferValue]").setValue(grid.store.sum("QOfferDetailLinePrice"));

                                    grid.getView().refresh();

                                    /*record.save({
                                        callback: function() {
                                            grid.store.reload();
                                        }
                                    });*/
                                }
                            }
                        }
                    }) : null,
                    // Grid Detail Toolbar
                    /*tbar: [
                        // {
                        //     xtype: 'searchfield',
                        //     width: '30%',
                        //     itemId: 'searchfield',
                        //     name: 'searchField',
                        //     listeners: {
                        //         'triggerclick': function(field) {
                        //             me.onSearchFieldDetailChange();
                        //         }
                        //     }
                        // }, 
                        {
                            xtype: 'component',
                            flex: 1
                        }, {
                            itemId: 'addline',
                            xtype: 'button',
                            text: 'Adicionar',
                            tooltip: 'Adi (Ins)',
                            handler: function() {
                                var me = this.up('form');
                                if (me.currentRecord.phantom) {
                                    me.onSaveHeaderOnly(me.onClickAddline);
                                } else {
                                    me.onClickAddline();
                                }
                            }
                        }
                    ]*/
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
                        text: 'Enviar',
                        disabled: me.currentRecord.data.isFinished || me.currentRecord.data.wasDesisted || me.currentRecord.data.wasCancelled,
                        listeners: {
                            click: {
                                fn: me.onSaveChanges,
                                scope: me
                            }
                        }
                    }, {
                        xtype: 'button',
                        glyph: 0xf251,
                        width: 90,
                        itemId: 'btnSaveDraft',
                        text: 'Rascunho',
                        disabled: me.currentRecord.data.isFinished || me.currentRecord.data.wasDesisted || me.currentRecord.data.wasCancelled,
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
                        itemId: 'btnSaveCancel',
                        text: 'Cancelar',
                        tooltip: 'Cancelar oferta',
                        disabled: me.currentRecord.data.isFinished || me.currentRecord.data.wasDesisted || me.currentRecord.data.wasCancelled,
                        hidden: me.currentRecord.phantom,
                        listeners: {
                            click: function(button, e, eOpts) {
                                var me = this.up('form');

                                Ext.Msg.show({
                                    title: 'Cancelar',
                                    msg: 'Você deseja desistir oferta?',
                                    buttons: Ext.Msg.YESNO,
                                    icon: Ext.Msg.QUESTION,
                                    fn: function(btn) {
                                        if (btn === "yes") {
                                            me.onSaveChanges(button, e, eOpts);
                                        }
                                    }
                                });
                            }
                        }
                    }, {
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
                afterrender: {
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
        var me = this;
        me.loadOfferDetails(me.currentRecord);
    },

    onSaveChanges: function(button, e, eOpts) {
        var me = this,
            form = me.getForm();

        if (!form.isValid()) {
            Ext.Msg.alert("Validação", "Verifique os dados!!!");
            return;
        }

        form.updateRecord();

        model = form.getRecord();

        var isPhantom = model.phantom;

        if (button.itemId === "btnSaveDraft") {
            model.data.QOfferDraft = true;
        } else {
            model.data.QOfferDraft = false;
        }

        if (button.itemId === "btnSaveCancel") {
            model.set("QOfferStatus", 2); // Mark as Cancelled in Database
        }

        me.getEl().mask('Guardar dados...');

        if (!model.data.QOfferDraft)
            model.getProxy().setSilentMode(true);

        model.save({
            success: function(record, operation) {
                me.saveItems(record);
            },
            failure: function() {
                me.getEl().unmask();
            }
        });
    },

    saveItems: function(savedRecord) {
        var me = this,
            grid = me.down("gridpanel"),
            store = grid.getStore();

        store.each(function(record) {
            record.getProxy().setSilentMode(true);
            record.set('QOfferKey', savedRecord.data.QOfferKey);
            record.set("QOfferDetailLinePrice", record.data.QOfferDetailQty * record.data.QOfferDetailPrice);
        });

        var toCreate = store.getNewRecords(),
            toUpdate = store.getUpdatedRecords(),
            toDestroy = store.getRemovedRecords(),
            needsSync = false;

        if (toCreate.length > 0 || toUpdate.length > 0 || toDestroy.length > 0) {
            needsSync = true;
        }

        if (needsSync) {
            store.sync({
                callback: function() {
                    me.getEl().unmask();
                    if (!savedRecord.data.QOfferDraft && savedRecord.data.QOfferStatus !== 2) {
                        Ext.Msg.show({
                            title: 'Nuvem B2B',
                            msg: 'Orçamento enviado corretamente',
                            buttons: Ext.Msg.OK,
                            icon: Ext.Msg.INFO
                        });
                    }
                    me.onBackToQuotes();
                }
            });
        } else {
            me.getEl().unmask();
            if (!savedRecord.data.QOfferDraft && savedRecord.data.QOfferStatus !== 2) {
                Ext.Msg.show({
                    title: 'Nuvem B2B',
                    msg: 'Orçamento enviado corretamente',
                    buttons: Ext.Msg.OK,
                    icon: Ext.Msg.INFO
                });
            }
            me.onBackToQuotes();
        }
    },

    loadOfferDetails: function(record) {
        var store = null,
            me = this,
            grid = me.down('gridpanel'),
            vendorKey = Nuvem.GlobalSettings.getCurrentUserVendorKey();

        me.getEl().mask("Carregando...");

        if (record.phantom) {
            storeItems = new Nuvem.store.QuoteDetails().load({
                params: {
                    fieldFilters: JSON.stringify({
                        fields: [
                            { name: 'QHeaderKey', type: 'int', value: record.data.QHeaderKey }
                        ]
                    })
                },
                callback: function(records, success, eOpts) {
                    if (records && records.length) {
                        store = new Nuvem.store.QuoteOfferDetails({ autoLoad: false });
                        Ext.Array.each(records, function(item, index) {
                            store.add(new Nuvem.model.QuoteOfferDetails({
                                ItemKey: item.data.ItemKey,
                                ItemName: item.data.ItemName,
                                QOfferDetailQty: item.data.QDetailQty
                            }));
                        });
                    }

                    grid.reconfigure(store);
                    me.getEl().unmask();
                    this.lastOptions.callback = null;
                }
            });
        } else {
            store = new Nuvem.store.QuoteOfferDetails().load({
                params: {
                    fieldFilters: JSON.stringify({
                        fields: [
                            { name: 'QOfferKey', type: 'int', value: record.data.QOfferKey }
                        ]
                    })
                },
                callback: function(records, success, eOpts) {
                    me.getEl().unmask();
                    grid.reconfigure(store);
                    this.lastOptions.callback = null;
                }
            });
        }
    },

    onBackToQuotes: function() {
        var me = this;
        var vp = me.up('app_viewport');
        var panel = vp.down('#app_ContentPanel');
        panel.remove(me);
        me.destroy();
        Ext.Router.redirect('!vendors');

        /*var vp = this.up('app_viewport');
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
    }
});
