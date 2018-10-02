Ext.define('Nuvem.view.vendors.EditQuoteHeaderMessages', {
    extend: 'Ext.form.Panel',
    alias: 'widget.vendors.EditQuoteHeaderMessages',
    modal: true,
    width: parseInt(screen.width * 0.3),
    maxWidth: parseInt(screen.width * 0.3),
    layout: 'column',
    title: 'Mensagens',
    closable: true,
    floating: true,
    callerForm: null,
    currentRecord: null,
    bodyPadding: '10 0 10 0',
    activeCheckBox: null,
    currentAnswer: null,
    selectedVendor: null,

    initComponent: function() {

        var me = this,
            vendorKey = Nuvem.GlobalSettings.getCurrentUserVendorKey();

        var qHeaderKey = (me.currentRecord) ? me.currentRecord.data.QHeaderKey : 0;

        var storeMessages = new Nuvem.store.QuoteMessages({ autoLoad: false }).load({
            params: {
                page: 0,
                start: 0,
                limit: 0,
                fieldFilters: JSON.stringify({
                    fields: [
                        { name: 'QHeaderKey', type: 'int', value: me.currentRecord.data.QHeaderKey },
                        { name: 'MessageVendorKey', type: 'int', value: vendorKey }
                    ]
                })
            },
            callback: function(records, operation, success) {
                var dvMessage = me.down('#dataViewMessage');
                dvMessage.bindStore(storeMessages);
                setTimeout(function() {
                    dvMessage.scrollToBottom();
                }, 200);
            }
        });


        Ext.applyIf(me, {
            fieldDefaults: {
                labelAlign: 'top',
                labelWidth: 60,
                msgTarget: 'side'
            },
            items: [
                // Mensagem
                {
                    xtype: 'fieldset',
                    itemId: 'fsChat',
                    title: 'Posts com comprador ' + me.currentRecord.data.CustName,
                    margin: '0 10 15 10',
                    columnWidth: 1,
                    padding: 10,
                    layout: 'column',
                    items: [
                        // Chat Panel
                        Ext.create('Ext.view.View', {
                            itemId: 'dataViewMessage',
                            columnWidth: 1,
                            style: {
                                overflow: 'auto'
                            },
                            store: storeMessages,
                            tpl: new Ext.XTemplate(
                                '<tpl for=".">',
                                '<div class="x-item {[this.getClassMessage(values)]}"><span class="nuvem-text-bubble">{QMessageText}</span>',
                                '<br/>',
                                '<span class="nuvem-message-datetime">{[this.getMessageDate(values)]}</span>',
                                '</div>',
                                '</tpl>', {
                                    getClassMessage: function(msg) {
                                        if(msg.QMessageFromCustKey) {
                                            return "nuvem-bubble-left";
                                        } else {
                                            return "nuvem-bubble-right";
                                        }
                                    },
                                    getMessageDate: function(msg) {
                                        var today = new Date();
                                        if(today.getFullYear() === msg.QMessageDate.getFullYear() && today.getMonth() === msg.QMessageDate.getMonth() && today.getDay() === msg.QMessageDate.getDay()) {
                                            return "hoje às {0} ".format(Ext.Date.format(msg.QMessageDate, "h:i a"));
                                        } else if(today.getFullYear() === msg.QMessageDate.getFullYear() && today.getMonth() === msg.QMessageDate.getMonth() && (today.getDay() - 1) === msg.QMessageDate.getDay()) {
                                            return "ontem às {0} ".format(Ext.Date.format(msg.QMessageDate, "h:i a"));
                                        } else {
                                            return Ext.Date.format(msg.QMessageDate, "d/m/Y h:i a");
                                        }
                                    }
                                }
                            ),
                            multiSelect: false,
                            minHeight: 322,
                            maxHeight: 322,
                            trackOver: true,
                            overItemCls: 'x-item-over',
                            itemSelector: 'div.x-item',
                            emptyText: 'Nenhum Mensagem',
                            selectedItemCls: 'data-view-chat-selected',

                            onItemSelect: function(record) {
                                var node = this._selectedNode; //this.getNode(record);

                                if (node) {
                                    Ext.fly(node).addCls(this.selectedItemCls);
                                }
                            },

                            onItemDeselect: function(record) {
                                var node = this._deselectedNode; //this.getNode(record);

                                if (node) {
                                    Ext.fly(node).removeCls(this.selectedItemCls);
                                }
                            },

                            processItemEvent: function(record, item, index, e) {
                                if (e.type === "mousedown" && e.button === 0) {
                                    this._deselectedNode = this._selectedNode;
                                    this._selectedNode = item;
                                }
                            },

                            updateIndexes: function(startIndex, endIndex) {
                                var ns = this.all.elements,
                                    records = this.store.getRange(),
                                    i, j;

                                startIndex = startIndex || 0;
                                endIndex = endIndex || ((endIndex === 0) ? 0 : (ns.length - 1));
                                for (i = startIndex, j = startIndex - 1; i <= endIndex; i++) {
                                    if (!Ext.fly(ns[i]).is('.x-item-child')) {
                                        j++;
                                    }

                                    ns[i].viewIndex = i;

                                    ns[i].viewRecordId = records[j].internalId;
                                    if (!ns[i].boundView) {
                                        ns[i].boundView = this.id;
                                    }
                                }
                            },

                            scrollToBottom: function() { 
                                var thisEl = this.getEl();   
                                thisEl.dom.scrollTop = thisEl.dom.scrollHeight;
                            }
                        }),
                        // Text Box send Panel
                        {
                            xtype: 'fieldcontainer',
                            margin: '20 0 0 0',
                            layout: 'hbox',
                            columnWidth: 1,
                            items: [
                                // Message Box
                                {
                                    xtype: 'textareafield',
                                    name:'txtMessage',
                                    flex: 1,
                                    rows: 3,
                                    disabled: me.currentRecord.data.isFinished
                                },
                                // Send Button
                                {
                                    xtype: 'button',
                                    margin: '15 0 0 5',
                                    glyph: 0xf1d8,
                                    itemId: 'btnSendMessge',
                                    scale: 'medium',
                                    border: false,
                                    width: 45,
                                    ui: 'plain',
                                    style: 'background-color:white!important; color:#157fcc !important; font-size: 20px !important;',
                                    iconAlign: 'left',
                                    tooltip: 'Enviar',
                                    handler: function(btn) {
                                        var me = btn.up('form'),
                                            value = me.down('field[name=txtMessage]').getValue();

                                        me.onSendMessageClick(value);
                                    },
                                    disabled: me.currentRecord.data.isFinished
                                },
                                // Attach Button
                                {
                                    xtype: 'button',
                                    margin: '15 0 0 0',
                                    glyph: 0xf0c6,
                                    itemId: 'btnSendFile',
                                    scale: 'medium',
                                    border: false,
                                    width: 45,
                                    ui: 'plain',
                                    style: 'background-color:white!important; color:#157fcc !important; font-size: 20px !important;',
                                    cls: 'nuvem-btn-mirror',
                                    iconAlign: 'left',
                                    tooltip: 'Enviar arquivo',
                                    handler: function(btn) {
                                        /*var me = btn.up('form'),
                                            value = me.down('field[name=txtMessage]').getValue();*/

                                        me.onSendFileClick(value);
                                    },
                                    disabled: me.currentRecord.data.isFinished
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
                        glyph: 0xf05e,
                        width: 90,
                        itemId: 'btnCancel',
                        text: 'Cancelar',
                        handler: function() {
                            var me = this.up('form');
                            me.destroy();
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
        var me = this;

        //me.setSize(Ext.getBody().getViewSize());
        me.setSize(screen.width * 70, me.height);
        //me.setPagePosition(0, 0);
        Ext.fly(window).on('resize', function(e, w) {
            //me.setSize(Ext.getBody().getViewSize());
            //me.setPagePosition(0, 0);
            me.setSize(screen.width * 70, me.height);
        });

        me.center();

        Nuvem.AppEvents.on('refreshChat', me.refreshChat, me);
    },

    onSelectChange: function(model, records) {
        var me = this;
        /*if(records && records.length)
            me.loadRecord(records[0]);*/
    },

    loadMessages: function(record) {
        var me = this,
            dvMessage = me.down('#dataViewMessage'),
            fsMessage = me.down('#fsChat'),
            interested = record;

        fsMessage.setTitle("{0}".format('Posts com fornecedor'));

        if (record && record.data) {
            fsMessage.setTitle("{0}: {1}".format('Posts com fornecedor', interested.data.InterestedVendorName));
            var storeMessages = new Nuvem.store.QuoteMessages({ autoLoad: false }).load({
                params: {
                    page: 0,
                    start: 0,
                    limit: 0,
                    fieldFilters: JSON.stringify({
                        fields: [
                            { name: 'QHeaderKey', type: 'int', value: me.currentRecord.data.QHeaderKey },
                            { name: 'MessageVendorKey', type: 'int', value: interested.data.InterestedVendorKey }
                        ]
                    })
                },
                callback: function(records, operation, success) {
                    dvMessage.bindStore(storeMessages);
                    setTimeout(function() {
                        dvMessage.scrollToBottom();
                    }, 200);
                    me.selectedVendor = record.data.InterestedVendorKey;
                }
            });
        }
    },

    onSendMessageClick: function(msg) {
        var me = this,
            quote = me.currentRecord.data,
            custKey = me.currentRecord.data.CustKey,
            vendorKey = Nuvem.GlobalSettings.getCurrentUserVendorKey();
        
        var record = new Nuvem.model.QuoteMessages({
            QHeaderKey: quote.QHeaderKey,
            QMessageText: msg,
            QMessageFromVendorKey: vendorKey,
            QMessageToCustKey: custKey
        });

        me.getEl().mask('Guardar dados...');
        record.getProxy().setSilentMode(true);
        record.save({
            success: function(record, operation) {
                me.getEl().unmask();
                me.down("field[name=txtMessage]").setValue(null);
                me.down("#dataViewMessage").store.reload();

                var obj2Send = {
                    CommandType: "ChatMessage",
                    CommandText: JSON.stringify(record.data)
                };

                var stringCommand = JSON.stringify(obj2Send);

                connection.send(stringCommand);
            },
            failure: function() {
                me.getEl().unmask();
            }
        });
    },

    refreshChat: function(record) {
        var me = this,
            vendorKey = parseInt(Nuvem.GlobalSettings.getCurrentUserVendorKey()),
            dvMessage = me.down('#dataViewMessage');

        console.log(record);

        if(record.QMessageToVendorKey === vendorKey)
            dvMessage.getStore().reload();
    }
});