Ext.define('Nuvem.view.purchasers.General', {
    extend: 'Ext.form.Panel',
    alias: 'widget.purchasersGeneral',
    xtype: 'purchasersGeneral',
    itemId: 'purchasersGeneral',

    layout: {
        type: 'column'
    },

    bodyPadding: 10,

    title: 'Visão Geral',

    initComponent: function() {
        var me = this,
            roleName = Nuvem.GlobalSettings.getCurrentUserRole(),
            commonHeight = 0.50;

        var firstDayOfYear = new Date();

        firstDayOfYear = new Date(firstDayOfYear.getFullYear(), 0, 1);

        var custFilter = new Ext.util.Filter({
            property: 'CustKey',
            value: Nuvem.GlobalSettings.getCurrentUserCustKey()
        });

        var storeQuoteHeaders = new Nuvem.store.QuoteHeaders({
            autoLoad: false,
            remoteFilter: true,
            pageSize: Math.round(((screen.height * (70 / 100)) - 40) / 35),
            filters: [custFilter]
        });

        var storeQuoteDetail = null;

        var selModel = Ext.create('Ext.selection.CheckboxModel', {
            checkOnly: true,
            listeners: {
                select: function(model, record) {
                    record.set('x_Selected', true);
                },
                deselect: function(model, record) {
                    record.set('x_Selected', false);
                }
            }
        });

        Ext.applyIf(me, {
            items: [
                // Grid Visão Geral
                {
                    xtype: 'gridpanel',
                    itemId: 'gridMain',
                    title: 'Últimas Cotações',
                    autoScroll: false,
                    scrollable: false,
                    viewConfig: {
                        stripeRows: true
                    },
                    //title: 'Header',
                    columnWidth: 1,
                    minHeight: (screen.height * commonHeight).toFixed(0),
                    maxHeight: (screen.height * commonHeight).toFixed(0),
                    margin: '0 5 5 0',
                    store: storeQuoteHeaders,
                    columns: [{
                        xtype: 'rownumberer',
                        width: 40
                    }, {
                        xtype: 'gridcolumn',
                        width: 100,
                        dataIndex: 'QHeaderDateBegin',
                        text: 'Data de Inicio',
                        renderer: Ext.util.Format.dateRenderer('d/m/Y')
                    }, {
                        xtype: 'gridcolumn',
                        width: 80,
                        dataIndex: 'QHeaderOC',
                        text: 'Ordem #'
                    }, {
                        xtype: 'gridcolumn',
                        flex:1,
                        dataIndex: 'QHeaderComments',
                        text: 'Comentários'
                    }, {
                        xtype: 'numbercolumn',
                        width: 100,
                        dataIndex: 'Interested',
                        text: 'Interessados',
                        align: 'center',
                        format: '00,000'
                    }, {
                        xtype: 'numbercolumn',
                        width: 100,
                        dataIndex: 'Offers',
                        text: 'Orçamentos',
                        align: 'center',
                        format: '00,000'
                    }, {
                        xtype: 'checkcolumn',
                        width: 80,
                        text: 'Finalizada',
                        dataIndex: 'isFinished',
                        columnHeaderCheckbox: false,
                        sortable: false,
                        hideable: false,
                        menuDisabled: true,
                        listeners: {
                            beforecheckchange: function(column, rowIndex, checked) {
                                // don't allow
                                return false;
                            }
                        }
                    }, {
                        xtype: 'checkcolumn',
                        width: 80,
                        text: 'Cancelada',
                        dataIndex: 'wasCancelled',
                        columnHeaderCheckbox: false,
                        sortable: false,
                        hideable: false,
                        menuDisabled: true,
                        listeners: {
                            beforecheckchange: function(column, rowIndex, checked) {
                                // don't allow
                                return false;
                            }
                        }
                    }, {
                        xtype: 'actioncolumn',
                        width: 30,
                        draggable: false,
                        resizable: false,
                        hideable: false,
                        stopSelection: false,
                        //text: 'Mensagens',
                        //style: 'padding-left:45px;',
                        items: [{
                            itemId: 'actionMessages',
                            handler: function(grid, rowIndex, colIndex) {
                                var me = this.up('form');
                                var record = grid.getStore().getAt(rowIndex);
                                me.onClickMessages(record);
                            },
                            tooltip: 'Mensagens',
                            getGlyph: function(itemScope, rowIdx, colIdx, item, rec) {
                                return 'xf0e6@FontAwesome';
                            }
                        }]
                    }, {
                        xtype: 'actioncolumn',
                        width: 30,
                        items: [{
                            tooltip: 'Orçamentos',
                            handler: function(grid, rowIndex, colIndex) {
                                var me = this.up('form');
                                var record = grid.getStore().getAt(rowIndex);
                                me.onClickOffer(record);
                            },
                            getGlyph: function(itemScope, rowIdx, colIdx, item, rec) {
                                return 'xf0d6@FontAwesome';
                            }
                        }]
                    }, {
                        xtype: 'actioncolumn',
                        width: 30,
                        items: [{
                            tooltip: 'Editar',
                            handler: function(grid, rowIndex, colIndex) {
                                var me = this.up('form');
                                var record = grid.getStore().getAt(rowIndex);
                                me.onClickEditHeader(record);
                            },
                            getGlyph: function(itemScope, rowIdx, colIdx, item, rec) {
                                return 'xf040@FontAwesome';
                            }
                        }]
                    }, {
                        xtype: 'actioncolumn',
                        width: 30,
                        hidden: true,
                        items: [{
                            handler: me.onClickDeleteColumn,
                            scope: me,
                            //iconCls: 'app-page-delete',
                            tooltip: 'Excluir',
                            getGlyph: function(itemScope, rowIdx, colIdx, item, rec) {
                                return 'xf014@FontAwesome';
                            }
                        }]
                    }],
                    selModel: selModel,
                    dockedItems: [
                        // Paging Toolbar
                        {
                            xtype: 'pagingtoolbar',
                            itemId: 'pagingtoolbar',
                            store: storeQuoteHeaders,
                            displayInfo: true,
                            dock: 'bottom',
                            displayMsg: 'Exibindo registros {0} - {1} de {2}',
                            emptyMsg: "Nenhum registro para mostrar",
                            listeners: {
                                change: function(pageTool, pageData, eOpts) {
                                    var me = this.up('form');
                                    me.RecalcTotals();
                                }
                            }
                        }
                    ],
                    tbar: [
                        // Search Field
                        {
                            xtype: 'searchfield',
                            flex: 3,
                            itemId: 'searchfield',
                            name: 'searchField',
                            listeners: {
                                'triggerclick': function(field) {
                                    me.onSearchFieldChange();
                                }
                            }
                        }, {
                            xtype: 'component',
                            flex: 1
                        },
                        // Buttons on Grid Header
                        {
                            margin: '0 0 0 15',
                            columnWidth: 0.1,
                            xtype: 'button',
                            text: 'Nova Cotação Produto',
                            handler: function() {
                                record = new Nuvem.model.QuoteHeaders({
                                    CustKey: Nuvem.GlobalSettings.getCurrentUserCustKey(),
                                    QHeaderDateBegin: new Date(),
                                    QHeaderType: 0
                                });

                                var form = Ext.widget('purchasers.EditQuoteHeaderItem', {
                                    currentRecord: record,
                                    isNewRecord: true
                                });
                                var vp = this.up('app_viewport');
                                form.loadRecord(record);
                                form.callerForm = this.up('form');

                                var panel = vp.down('#app_ContentPanel');

                                me.hide(); //panel.removeAll();
                                panel.add(form);

                                form.getEl().slideIn('r', {
                                    easing: 'backOut',
                                    duration: 1000,
                                    listeners: {
                                        afteranimate: function() {
                                            //formDetail.down("field[name=searchField]").focus(true, 200);
                                        }
                                    }
                                });
                            }
                        }, {
                            margin: '0 0 0 15',
                            columnWidth: 0.1,
                            xtype: 'button',
                            text: 'Nova Cotação Serviço',
                            handler: function() {
                                record = new Nuvem.model.QuoteHeaders({
                                    CustKey: Nuvem.GlobalSettings.getCurrentUserCustKey(),
                                    QHeaderDateBegin: new Date(),
                                    QHeaderType: 1
                                });

                                var form = Ext.widget('purchasers.EditQuoteHeaderService', {
                                    currentRecord: record,
                                    isNewRecord: true
                                });
                                var vp = this.up('app_viewport');
                                form.loadRecord(record);
                                form.callerForm = this.up('form');

                                var panel = vp.down('#app_ContentPanel');

                                me.hide();
                                panel.add(form);

                                form.getEl().slideIn('r', {
                                    easing: 'backOut',
                                    duration: 1000
                                });
                            }
                        }
                    ],
                    // Grid Quote Header Listeners
                    listeners: {
                        selectionchange: {
                            fn: me.onSelectChange,
                            scope: me
                        } //,
                        /*viewready: function(grid) {
                            var view = grid.view;

                            // record the current cellIndex
                            grid.mon(view, {
                                uievent: function(type, view, cell, recordIndex, cellIndex, e) {
                                    grid.cellIndex = cellIndex;
                                    grid.recordIndex = recordIndex;
                                }
                            });

                            grid.tip = Ext.create('Ext.tip.ToolTip', {
                                target: view.el,
                                delegate: '.x-grid-cell',
                                trackMouse: true,
                                renderTo: Ext.getBody(),
                                listeners: {
                                    beforeshow: function updateTipBody(tip) {
                                        // if (!Ext.isEmpty(grid.cellIndex) && grid.cellIndex !== -1) {
                                        //     header = grid.headerCt.getGridColumns()[grid.cellIndex + 1];
                                        //     console.log(grid.cellIndex, grid.headerCt.getGridColumns());
                                        //     tip.update(grid.getStore().getAt(grid.recordIndex).get(header.dataIndex));
                                        // }
                                        record = grid.getStore().getAt(grid.recordIndex);
                                        var myToolTipText = "";
                                        myToolTipText = myToolTipText + "<br/><b>Data de Fechamento:</b> {0}".format(Ext.Date.format(record.get('QHeaderDateEnd'), 'd/m/Y'));
                                        myToolTipText = myToolTipText + "<br/><b>IMPA:</b> {0}".format(record.get('QHeaderIMPA'));
                                        myToolTipText = myToolTipText + "<br/><b>Categoría:</b> {0}".format(record.get('CategoryName'));

                                        var numFianza = record.get('QHeaderNumFianza');
                                        if (!String.isNullOrEmpty(numFianza))
                                            myToolTipText = myToolTipText + "<br/># Fianza: {0}".format(record.get('QHeaderNumFianza'));
                                        tip.update(myToolTipText);
                                    }
                                }
                            });

                        }*/
                    }
                }
            ],
            // Form Listeners
            listeners: {
                afterrender: {
                    fn: me.onRenderForm,
                    scope: me
                }
            }
        });

        me.callParent(arguments);
    },

    onRenderForm: function() {
        var me = this;
        me.onSearchFieldChange(true);
    },

    onSearchFieldChange: function(fromOnRenderForm) {
        var me = this,
            field = me.down('#searchfield'),
            fieldValue = field.getRawValue(),
            grid = me.down('#gridMain');

        grid.store.removeAll();

        if (!fromOnRenderForm) {
            chartA.getEl().mask('Carregando');
        }

        if (!String.isNullOrEmpty(fieldValue)) {
            grid.store.loadPage(1, {
                params: {
                    query: fieldValue
                }
            });

        } else {
            grid.store.loadPage(1, {
                callback: function() {
                    //me.RecalcTotals();
                    this.lastOptions.callback = null;
                }
            });
        }
    },

    onClickEditHeader: function(record) {
        if (!Ext.isObject(record)) return;

        Ext.Router.redirect('!purchasers/quote/{0}'.format(record.data.QHeaderKey));

        /*var me = this;
        var callerForm = this;
        var selectedRecord = record;
        var vp = me.up('app_viewport');

        me.getEl().mask('Carregando...');

        var storeQuoteHeaders = new Nuvem.store.QuoteHeaders().load({
            params: {
                id: selectedRecord.data.QHeaderKey
            },
            callback: function(records, success, eOpts) {
                var form = (records[0].data.QHeaderType === 0) ? new Nuvem.view.purchasers.EditQuoteHeaderItem({
                    currentRecord: records[0],
                    title: 'Cotação Produto'
                }) : new Nuvem.view.purchasers.EditQuoteHeaderService({
                    currentRecord: records[0],
                    title: 'Cotação Serviço'
                });

                form.loadRecord(records[0]);
                form.callerForm = callerForm;

                var panel = vp.down('#app_ContentPanel');

                me.hide();
                panel.add(form);

                form.getEl().slideIn('r', {
                    easing: 'backOut',
                    duration: 1000,
                    listeners: {
                        afteranimate: function() {
                            //formDetail.down("field[name=searchField]").focus(true, 200);
                        }
                    }
                });

                //Ext.Msg.hide();
                me.getEl().unmask();

                this.lastOptions.callback = null;
            }
        });*/
    },

    onSelectChange: function(model, records) {
        var me = this;
    },

    RecalcTotals: function(fromChecked) {
        var me = this,
            grid = me.down('#gridMain'),
            store = grid.store,
            totalInQuotes = 0,
            profitPct = 0,
            dateTo = new Date(),
            daysProm = 0;
    },

    onExportExcel: function() {
        var me = this,
            grid = me.down('#gridMain');

        Ext.Msg.wait('Carregando Report....', 'Aguarde');
        Ext.Ajax.request({
            url: '../wa/Reports/Export2Excel',
            method: 'GET',
            headers: {
                'Authorization-Token': Nuvem.GlobalSettings.tokenAuth
            },
            params: grid.store.lastOptions.params,
            success: function(response) {
                var text = response.responseText;
                //window.open('../wa/Reports/GetPDFReport?_file=' + text, 'Quote Customer','width='+screen.width+',height='+screen.height);
                window.open('../wa/Reports/GetExcel?_file=' + text, 'Quotes');
                Ext.Msg.hide();
            }
        });
    },

    onClickDeleteColumn: function(view, rowIndex, colIndex, item, e, record) {
        var me = this;

        var grid = me.down('gridpanel');

        Ext.Msg.show({
            title: 'Excluir',
            msg: 'Você deseja excluir?',
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.QUESTION,
            fn: function(btn) {
                if (btn === "yes") {
                    record.destroy();
                }
            }
        });
    },

    onClickMessages: function(record) {
        if (!Ext.isObject(record)) return;

        var callerForm = this;
        var form = new Nuvem.view.purchasers.EditQuoteHeaderMessages({ currentRecord: record });
        form.callerForm = callerForm;
        form.center().show();
    },

    onClickOffer: function(record) {
        if (!Ext.isObject(record)) return;

        console.log(record);
        
        Ext.Router.redirect('!purchasers/offer/{0}'.format(record.data.QHeaderKey));
    }
});