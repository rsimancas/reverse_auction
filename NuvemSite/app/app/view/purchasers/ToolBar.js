Ext.define('Nuvem.view.purchasers.ToolBar', {
    extend: 'Ext.toolbar.Toolbar',
    xtype: 'app_toolbar_purchasers',
    style: 'background-color:transparent;',
    itemId: 'purchaserToolbar',

    initComponent: function() {
        var me = this;

        var auth = Ext.util.Cookies.get("Nuvem.CurrentUser");

        var currentUser = Ext.JSON.decode(auth);
        var tipo = typeof currentUser.UserName;

        var fullName = ("string" == tipo) ? currentUser.UserName : '';

        Ext.apply(me, {
            items: [{
                xtype: 'label',
                text: 'VISÃO COMPRADOR',
                margin: '-1 0 0 0',
                style: 'font-size:15px; color: white; font-weight: bold;'
            }, {
                xtype: 'component',
                flex: 1
            }, {
                xtype: 'notifybutton',
                width: 48,
                itemId: 'purchasersNotifyButton',
                listeners: {
                    click: {
                        element: 'el',
                        scope: me, //bind to the underlying el property on the panel
                        fn: function() {
                            var me = this.down("#purchasersNotifyButton");

                            var panel = Ext.create('Ext.panel.Panel', {
                                title: 'Notificações',
                                floating: true, // required
                                closable: true, // show close btn
                                closeAction: 'hide', // no destroy
                                width: 250,
                                layout: 'column',
                                items: [
                                    Ext.create('Ext.view.View', {
                                        itemId: 'dataViewNotify',
                                        columnWidth: 1,
                                        style: {
                                            'overflow-y': 'auto'
                                        },
                                        store: me.store,
                                        tpl: new Ext.XTemplate(
                                            '<tpl for=".">',
                                            '<div class="x-item {[this.getClassMessage(values)]}"><span>{NotifyDescription}</span>',
                                            '</div>',
                                            '</tpl>', {
                                                getClassMessage: function(msg) {
                                                    if (msg.NotifyRead) {
                                                        return "nuvem-notify-read";
                                                    } else {
                                                        return "nuvem-notify-unread";
                                                    }
                                                    //return "nuvem-notify-unread";
                                                }
                                            }
                                        ),
                                        multiSelect: false,
                                        minHeight: 250,
                                        maxHeight: 250,
                                        trackOver: true,
                                        overItemCls: 'x-item-over',
                                        itemSelector: 'div.x-item',
                                        emptyText: 'Nenhum Notificações',
                                        selectedItemCls: 'nuvem-notify-read',

                                        onItemSelect: function(record) {
                                            var node = this._selectedNode,
                                                me = this; //this.getNode(record);

                                            if (!record.data.NotifyRead) {
                                                this.getEl().mask('Espere...');
                                                record.set('NotifyRead', true);
                                                record.getProxy().setSilentMode(true);
                                                record.save({
                                                    success: function() {

                                                        me.getEl().unmask();

                                                    }
                                                });

                                            }

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
                                        listeners: {
                                            viewready: function(dv) {
                                                /*if (dv.getNodes().length) {
                                                    dv.selModel.select(0);
                                                    dv._deselectedNode = dv._selectedNode;
                                                    dv._selectedNode = dv.getNodes()[0];
                                                    dv.onItemSelect(dv.store.getAt(0));
                                                }*/
                                            }
                                        },

                                        scrollToBottom: function() {
                                            var thisEl = this.getEl();
                                            thisEl.dom.scrollTop = thisEl.dom.scrollHeight;
                                        }
                                    })
                                ],
                                bodyPadding: 5
                            });

                            panel.showBy(this, 'b'); // 'b' = bottom
                        }
                    },
                    afterrender: {
                        fn: function() {
                            Ext.tip.QuickTipManager.register({
                                target: 'purchasersNotifyButton',
                                title: 'Nuvem',
                                text: 'click para assistir novas notificações',
                                width: 100,
                                dismissDelay: 10000 // Hide after 10 seconds hover
                            });
                        }
                    }
                }
            }, '-', {
                xtype: 'button',
                text: 'Visão Geral',
                cls: 'x-btn-toolbar-small-cus',
                itemId: 'btnGeneral',
                listeners: {
                    click: function() {
                        Ext.Router.redirect('!purchasers');
                    }
                }
            }, '-', {
                xtype: 'button',
                text: 'Painel de Controle',
                cls: 'x-btn-toolbar-small-cus',
                itemId: 'btnPanel',
                listeners: {
                    click: function() {
                        Ext.Router.redirect('!purchasers/panel');
                    }
                }
            }, '-', {
                xtype: 'button',
                text: 'Suporte',
                cls: 'x-btn-toolbar-small-cus',
                handler: function() {
                    Ext.Router.redirect('!purchasers/support');
                }
            }, '-', {
                xtype: 'splitbutton',
                iconCls: 'fa fa-user-circle nuvem-btn-dark nuvem-medium',
                text: fullName,
                menu: [{
                    iconCls: 'nuvem-btn-dark',
                    glyph: 'xf08b@FontAwesome',
                    text: 'Logout',
                    handler: Ext.logoutApp
                }]
            }]
        });

        this.callParent(arguments);
    }
});
