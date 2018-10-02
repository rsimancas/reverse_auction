Ext.define('Nuvem.view.common.ToolBar', {
    extend: 'Ext.toolbar.Toolbar',
    xtype: 'app_toolbar',
    style: 'background-color:transparent;',

    initComponent: function() {

        var auth = Ext.util.Cookies.get("Nuvem.CurrentUser");

        var currentUser = Ext.JSON.decode(auth);
        var tipo = typeof currentUser.UserName;

        var fullName = ("string" == tipo) ? currentUser.UserName : '';

        Ext.apply(this, {
            items: [{
                xtype: 'component',
                flex: 1
            }, '-', {
                xtype: 'button',
                text: 'Quotes',
                itemId: 'quotesbtn',
                cls: 'x-btn-toolbar-small-cus',
                handler: function() {
                    var vp = this.up('app_viewport');

                    // var myxMask = new Ext.LoadMask({
                    //     target: Ext.getBody(),
                    //     msg: "Aguarde..."
                    // });

                    // myxMask.show();

                    vp.getEl().mask("Aguarde...");

                    var form = Ext.widget('quoteslist', {});

                    var panel = vp.down('#app_ContentPanel');

                    panel.removeAll();
                    panel.add(form);

                    form.getEl().slideIn('r', {
                        easing: 'backOut',
                        duration: 1000,
                        listeners: {
                            afteranimate: function() {
                                form.down("#searchfield").focus(true, 200);
                                vp.getEl().unmask();
                            }
                        }
                    });
                }
            }, '-', {
                xtype: 'button',
                text: 'History Search',
                cls: 'x-btn-toolbar-small-cus',
                handler: function() {
                    var vp = this.up('app_viewport');

                    vp.getEl().mask("Aguarde...");

                    var form = Ext.widget('historysearchlist', {});

                    var panel = vp.down('#app_ContentPanel');

                    panel.removeAll();
                    panel.add(form);

                    form.getEl().slideIn('r', {
                        easing: 'backOut',
                        duration: 1000,
                        listeners: {
                            afteranimate: function() {
                                form.down("#searchfield").focus(true, 200);
                                vp.getEl().unmask();
                            }
                        }
                    });
                }
            }, '-', {
                xtype: 'splitbutton',
                text: 'Database',
                disabled: (Nuvem.GlobalSettings.getCurrentUserLevel() === -1),
                menu: [
                    //Customers
                    {
                        text: 'Customers',
                        handler: function() {
                            var vp = this.up('app_viewport');

                            vp.getEl().mask("Aguarde...");

                            var form = Ext.widget('customerslist', {});

                            var panel = vp.down('#app_ContentPanel');

                            panel.removeAll();
                            panel.add(form);

                            form.getEl().slideIn('r', {
                                easing: 'backOut',
                                duration: 1000,
                                listeners: {
                                    afteranimate: function() {
                                        form.down("field[name=searchField]").focus(true, 200);
                                        vp.getEl().unmask();
                                    }
                                }
                            });
                        }
                    },
                    // Vendors
                    {
                        text: 'Vendors',
                        handler: function() {

                            var vp = this.up('app_viewport');

                            vp.getEl().mask("Aguarde...");

                            var form = Ext.widget('vendorslist', {});

                            var panel = vp.down('#app_ContentPanel');

                            panel.removeAll();
                            panel.add(form);

                            form.getEl().slideIn('r', {
                                easing: 'backOut',
                                duration: 1000,
                                listeners: {
                                    afteranimate: function() {
                                        form.down("field[name=searchField]").focus(true, 200);
                                        vp.getEl().unmask();
                                    }
                                }
                            });
                        }
                    },
                    // Items
                    {
                        text: 'Items',
                        handler: function() {

                            var vp = this.up('app_viewport');

                            vp.getEl().mask("Aguarde...");

                            var form = Ext.widget('itemslist', {
                                title: 'Items'
                            });

                            var panel = vp.down('#app_ContentPanel');

                            panel.removeAll();
                            panel.add(form);

                            form.getEl().slideIn('r', {
                                easing: 'backOut',
                                duration: 1000,
                                listeners: {
                                    afteranimate: function() {
                                        form.down("field[name=searchField]").focus(true, 200);
                                        vp.getEl().unmask();
                                    }
                                }
                            });
                        }
                    },
                    // Status
                    {
                        text: 'Status',
                        handler: function() {

                            var vp = this.up('app_viewport');

                            vp.getEl().mask("Aguarde...");

                            var form = Ext.widget('statuslist', {});

                            var panel = vp.down('#app_ContentPanel');

                            panel.removeAll();
                            panel.add(form);

                            form.getEl().slideIn('r', {
                                easing: 'backOut',
                                duration: 1000,
                                listeners: {
                                    afteranimate: function() {
                                        form.down("field[name=searchField]").focus(true, 200);
                                        vp.getEl().unmask();
                                    }
                                }
                            });
                        }
                    },
                    // Brokers
                    {
                        text: 'Brokers',
                        handler: function() {

                            var vp = this.up('app_viewport');

                            vp.getEl().mask("Aguarde...");

                            var form = Ext.widget('brokerslist', {});

                            var panel = vp.down('#app_ContentPanel');

                            panel.removeAll();
                            panel.add(form);

                            form.getEl().slideIn('r', {
                                easing: 'backOut',
                                duration: 1000,
                                listeners: {
                                    afteranimate: function() {
                                        form.down("field[name=searchField]").focus(true, 200);
                                        vp.getEl().unmask();
                                    }
                                }
                            });
                        }
                    },
                    // Sequences
                    {
                        text: 'Sequences',
                        handler: function() {

                            var vp = this.up('app_viewport');

                            vp.getEl().mask("Aguarde...");

                            var form = Ext.widget('sequenceslist', {});

                            var panel = vp.down('#app_ContentPanel');

                            panel.removeAll();
                            panel.add(form);

                            form.getEl().slideIn('r', {
                                easing: 'backOut',
                                duration: 1000,
                                listeners: {
                                    afteranimate: function() {
                                        form.down("field[name=searchField]").focus(true, 200);
                                        vp.getEl().unmask();
                                    }
                                }
                            });
                        }
                    },
                    // CurrencyRates
                    {
                        text: 'Currency Rates',
                        handler: function() {

                            var vp = this.up('app_viewport');

                            vp.getEl().mask("Aguarde...");

                            var form = Ext.widget('currencyrateslist', {});

                            var panel = vp.down('#app_ContentPanel');

                            panel.removeAll();
                            panel.add(form);

                            form.getEl().slideIn('r', {
                                easing: 'backOut',
                                duration: 1000,
                                listeners: {
                                    afteranimate: function() {
                                        form.down("field[name=searchField]").focus(true, 200);
                                        vp.getEl().unmask();
                                    }
                                }
                            });
                        }
                    },
                    // Document Types
                    {
                        text: 'Document Types',
                        handler: function() {

                            var vp = this.up('app_viewport');

                            vp.getEl().mask("Aguarde...");

                            var form = Ext.widget('documenttypeslist', {});

                            var panel = vp.down('#app_ContentPanel');

                            panel.removeAll();
                            panel.add(form);

                            form.getEl().slideIn('r', {
                                easing: 'backOut',
                                duration: 1000,
                                listeners: {
                                    afteranimate: function() {
                                        form.down("field[name=searchField]").focus(true, 200);
                                        vp.getEl().unmask();
                                    }
                                }
                            });
                        }
                    },
                    // Payment Methods
                    {
                        text: 'Payment Methods',
                        handler: function() {

                            var vp = this.up('app_viewport');

                            vp.getEl().mask("Aguarde...");

                            var form = Ext.widget('paymentmodeslist', {});

                            var panel = vp.down('#app_ContentPanel');

                            panel.removeAll();
                            panel.add(form);

                            form.getEl().slideIn('r', {
                                easing: 'backOut',
                                duration: 1000,
                                listeners: {
                                    afteranimate: function() {
                                        form.down("field[name=searchField]").focus(true, 200);
                                        vp.getEl().unmask();
                                    }
                                }
                            });
                        }
                    },
                    // Banking Institutions
                    {
                        text: 'Banking Institutions',
                        handler: function() {

                            var vp = this.up('app_viewport');

                            vp.getEl().mask("Aguarde...");

                            var form = Ext.widget('bankslist', {});

                            var panel = vp.down('#app_ContentPanel');

                            panel.removeAll();
                            panel.add(form);

                            form.getEl().slideIn('r', {
                                easing: 'backOut',
                                duration: 1000,
                                listeners: {
                                    afteranimate: function() {
                                        form.down("field[name=searchField]").focus(true, 200);
                                        vp.getEl().unmask();
                                    }
                                }
                            });
                        }
                    },
                    // Bank Accounts
                    {
                        text: 'Bank Accounts',
                        handler: function() {

                            var vp = this.up('app_viewport');

                            vp.getEl().mask("Aguarde...");

                            var form = Ext.widget('bankaccountslist', {});

                            var panel = vp.down('#app_ContentPanel');

                            panel.removeAll();
                            panel.add(form);

                            form.getEl().slideIn('r', {
                                easing: 'backOut',
                                duration: 1000,
                                listeners: {
                                    afteranimate: function() {
                                        form.down("field[name=searchField]").focus(true, 200);
                                        vp.getEl().unmask();
                                    }
                                }
                            });
                        }
                    }
                ]
            }, '-', {
                xtype: 'splitbutton',
                iconCls: 'app-user',
                text: fullName,
                menu: [{
                    iconCls: 'app-logout',
                    text: 'Logout',
                    handler: Ext.logoutApp
                }]
            }]
        });

        this.callParent(arguments);
    }
});
