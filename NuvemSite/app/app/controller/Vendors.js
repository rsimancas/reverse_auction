Ext.define('Nuvem.controller.Vendors', {
    extend: 'Ext.app.Controller',

    models: [

    ],

    stores: [

    ],

    views: [
        
    ],

    /*initVendors: function(application) {
        var me = this;
        Ext.checkSecurityToken();

        var user = Nuvem.GlobalSettings.currentUser;

        if (!user.VendorKey) {
            Ext.Router.redirect('!');
            return;
        }

        if (user.UserFirstLogon) {
            Ext.Router.redirect('!vendors/panel/firstlogon');
            return;
        }

        var askBeforeOut = function() {
            return 'Você quer sair?';
        };

        window.onbeforeunload = askBeforeOut;
        Nuvem.GlobalSettings.modeApp = 'vendors';
        Nuvem.GlobalSettings.firstSession = false;

        var viewport = Ext.ComponentQuery.query("#appViewPort");

        if (!viewport.length) {
            Nuvem.AppEvents.on('viewportLoaded', function() {
                var toolbar = Ext.ComponentQuery.query("#vendorToolbar")[0];
                var btn = toolbar.down("#btnGeneral");
                setTimeout(function() {
                    btn.fireEvent('click', btn);
                }, 500);
            });
        } else {
            var toolbar = Ext.ComponentQuery.query("#vendorToolbar")[0];
            var btn = toolbar.down("#btnGeneral");
            btn.fireEvent('click', btn);
        }
    },*/

    firstLogonVendor: function(application) {
        Ext.checkSecurityToken();

        var user = Nuvem.GlobalSettings.currentUser;

        if (!user.VendorKey) {
            Ext.Router.redirect('!');
            return;
        }


        var askBeforeOut = function() {
            return 'Você quer sair?';
        };

        window.onbeforeunload = askBeforeOut;
        Nuvem.GlobalSettings.modeApp = 'vendors';
        Nuvem.GlobalSettings.firstSession = true;

        var viewport = Ext.ComponentQuery.query("#appViewPort");

        if (!viewport.length) {
            Nuvem.AppEvents.on('viewportLoaded', function() {
                var toolbar = Ext.ComponentQuery.query("#vendorToolbar")[0];
                var btn = toolbar.down("#btnPanel");
                setTimeout(function() {
                    btn.fireEvent('click', btn);
                }, 500);
            });
        } else {
            var toolbar = Ext.ComponentQuery.query("#vendorToolbar")[0];
            var btn = toolbar.down("#btnPanel");
            btn.fireEvent('click', btn);
        }
    },

    initGeneral: function(application) {
        Ext.checkSecurityToken();

        var user = Nuvem.GlobalSettings.currentUser;

        if (!user.VendorKey) {
            Ext.Router.redirect('!');
            return;
        }

        var askBeforeOut = function() {
            return 'Você quer sair?';
        };

        window.onbeforeunload = askBeforeOut;

        var viewport = Ext.ComponentQuery.query("#appViewPort");

        var createGeneral = function() {
            var vp = viewport[0];

            vp.getEl().mask("Aguarde...");

            var form = Ext.widget('vendorsGeneral', {});

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
        };

        if (!viewport.length) {
            Nuvem.AppEvents.on('viewportLoaded', function() {
                setTimeout(function() {
                    createGeneral();
                }, 400);
            });
        } else {
            var formQuotes = viewport[0].down("#vendorsGeneral");
            if (!formQuotes) {
                createGeneral();
            } else {
                var cpanel = viewport[0].down("#app_ContentPanel"),
                    currentForm = cpanel.down('form');

                formQuotes.down('#pagingtoolbar').doRefresh(function() {
                    this.lastOptions.callback = null;
                });

                formQuotes.show();
                formQuotes.getEl().slideIn('l', {
                    easing: 'backOut',
                    duration: 1000
                });
            }
        }
    },

    initControlPanel: function(application) {
        Ext.checkSecurityToken();

        var user = Nuvem.GlobalSettings.currentUser;

        if (!user.VendorKey) {
            Ext.Router.redirect('!');
            return;
        }

        var askBeforeOut = function() {
            return 'Você quer sair?';
        };

        window.onbeforeunload = askBeforeOut;

        var createPanel = function() {
            var vp = viewport[0];

            vp.getEl().mask("Aguarde...");

            var form = Ext.widget('vendorsPanel', {});

            var panel = vp.down('#app_ContentPanel');

            panel.removeAll();
            panel.add(form);

            form.getEl().slideIn('r', {
                easing: 'backOut',
                duration: 1000,
                listeners: {
                    afteranimate: function() {
                        if (form.down("#searchfield"))
                            form.down("#searchfield").focus(true, 200);
                        vp.getEl().unmask();
                    }
                }
            });
        };

        var viewport = Ext.ComponentQuery.query("#appViewPort");

        if (!viewport.length) {
            Nuvem.AppEvents.on('viewportLoaded', function() {
                createPanel();
            });
        } else {
            var formPanel = viewport[0].down("#vendorsPanel");
            if (!formPanel) {
                createPanel();
            } else {
                var cpanel = viewport[0].down("#app_ContentPanel");

                formPanel.show();
                formPanel.getEl().slideIn('l', {
                    easing: 'backOut',
                    duration: 1000
                });
            }
        }
    },

    initSupport: function(application) {
        Ext.checkSecurityToken();

        var user = Nuvem.GlobalSettings.currentUser;

        if (!user.VendorKey) {
            Ext.Router.redirect('!');
            return;
        }

        var askBeforeOut = function() {
            return 'Você quer sair?';
        };

        window.onbeforeunload = askBeforeOut;

        var createSupport = function() {
            var vp = viewport[0];

            vp.getEl().mask("Aguarde...");

            var form = Ext.widget('vendorsSupport', {});

            var panel = vp.down('#app_ContentPanel');

            panel.removeAll();
            panel.add(form);

            form.getEl().slideIn('r', {
                easing: 'backOut',
                duration: 1000,
                listeners: {
                    afteranimate: function() {
                        if (form.down("#searchfield"))
                            form.down("#searchfield").focus(true, 200);
                        vp.getEl().unmask();
                    }
                }
            });
        };

        var viewport = Ext.ComponentQuery.query("#appViewPort");

        if (!viewport.length) {
            Nuvem.AppEvents.on('viewportLoaded', function() {
                createSupport();
            });
        } else {
            var form = viewport[0].down("#vendorsSupport");
            if (!form) {
                createSupport();
            } else {
                var cpanel = viewport[0].down("#app_ContentPanel");

                form.show();
                form.getEl().slideIn('l', {
                    easing: 'backOut',
                    duration: 1000
                });
            }
        }
    },

    editQuote: function(params) {
        Ext.checkSecurityToken();
        var user = Nuvem.GlobalSettings.currentUser;

        if (!user.VendorKey) {
            Ext.Router.redirect('!');
            return;
        }

        var viewport = Ext.ComponentQuery.query("#appViewPort")[0],
            cpanel = Ext.ComponentQuery.query("#app_ContentPanel")[0],
            callerForm = cpanel.down("#vendorsGeneral");

        cpanel.getEl().mask('Carregando...');

        this.loadQuote(params.id).then(function(record) {
            var form = (record.data.QHeaderType === 0) ? new Nuvem.view.vendors.EditQuoteHeaderItem({
                currentRecord: record,
                title: 'Cotação Produto'
            }) : new Nuvem.view.vendors.EditQuoteHeaderService({
                currentRecord: record,
                title: 'Cotação Serviço'
            });

            form.loadRecord(record);

            form.callerForm = callerForm;

            if (callerForm) {
                callerForm.hide();
            }

            cpanel.add(form);

            form.getEl().slideIn('r', {
                easing: 'backOut',
                duration: 1000,
                listeners: {
                    afteranimate: function() {
                        //formDetail.down("field[name=searchField]").focus(true, 200);
                    }
                }
            });

            cpanel.getEl().unmask();
        });
    },

    loadQuote: function(id) {
        var deferred = Ext.create('Deft.Deferred');

        new Nuvem.store.QuoteHeaders().load({
            params: {
                id: id
            },
            callback: function(records, operation, success) {
                if (success) {
                    deferred.resolve(records[0]);
                } else {
                    deferred.reject("Error loading Companies.");
                }
            }
        });

        return deferred.promise;
    },

    editOffer: function(params) {
        Ext.checkSecurityToken();
        var user = Nuvem.GlobalSettings.currentUser;

        if (!user.VendorKey) {
            Ext.Router.redirect('!');
            return;
        }

        var viewport = Ext.ComponentQuery.query("#appViewPort")[0],
            cpanel = Ext.ComponentQuery.query("#app_ContentPanel")[0],
            callerForm = cpanel.down("#vendorsGeneral");

        cpanel.getEl().mask('Carregando...');

        this.loadOffer(params.id, user.VendorKey).then(function(record) {

            var form = new Nuvem.view.vendors.EditQuoteHeaderOffers({
                currentRecord: record
            });

            if (callerForm) {
                callerForm.hide();
            } else {
                cpanel.removeAll();
            }

            form.callerForm = callerForm;

            var model = null;

           /* if (Ext.isObject(record)) {
                model = record;
            } else {
                model = new Nuvem.model.QuoteOffers({
                    QHeaderKey: record.data.QHeaderKey,
                    VendorKey: user.VendorKey
                });
            }*/

            form.loadRecord(record);
            form.currentRecord = record;

            //me.hide();
            cpanel.add(form);

            form.getEl().slideIn('r', {
                easing: 'backOut',
                duration: 1000,
                listeners: {
                    afteranimate: function() {
                        //formDetail.down("field[name=searchField]").focus(true, 200);
                    }
                }
            });

            cpanel.getEl().unmask();
        });
    },

    loadOffer: function(id, vendorKey) {
        var deferred = Ext.create('Deft.Deferred');

        new Nuvem.store.QuoteOffers().load({
            params: {
                fieldFilters: JSON.stringify({
                    fields: [
                        { name: 'QHeaderKey', type: 'int', value: id },
                        { name: 'VendorKey', type: 'int', value: vendorKey }
                    ]
                })
            },
            callback: function(records, operation, success) {
                if (success) {
                    var record = (records.length) ? records[0] : new Nuvem.model.QuoteOffers({
                        QHeaderKey: id,
                        VendorKey: vendorKey
                    });

                    if(this.getCount() === 0)
                        this.add(record);

                    deferred.resolve(record);
                } else {
                    deferred.reject("Error loading Companies.");
                }
            }
        });

        return deferred.promise;
    }
});
