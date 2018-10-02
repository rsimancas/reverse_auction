function setCookie(key, value, expires) {
    //var expires = new Date(d.setHours(23, 59, 59, 999));
    //expires.setTime(expires.getTime() + (1 * 24 * 60 * 60 * 1000));
    document.cookie = key + '=' + value + ';path=/;expires=' + expires.toUTCString();
}

function getCookie(key) {
    var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
    return keyValue ? keyValue[2] : null;
}

function eraseCookie(key) {
    var d = new Date();
    var expiry = new Date(d.setHours(-23, 59, 59, 999)); // at end of day
    setCookie(key, "", expiry);
}

function checkIfLogged() {
    var auth = getCookie("Nuvem.AppAuth"),
        user = getCookie("Nuvem.CurrentUser");

    if (auth && auth !== null) {
        user = JSON.parse(user);

        waitingDialog.show('Iniciando Sessão...');
        if (user.CustKey && user.CustKey > 0) {
            location.href = "app/#!purchasers";
        } else if (user.VendorKey && user.VendorKey > 0) {
            location.href = "app/#!vendors";
        } else {
            eraseCookie("Nuvem.AppAuth");
            ereseCookie("Nuvem.CurrentUser");
        }
    }
}

// Completed Register
function completedRegister(data) {
    // get the form data
    // there are many ways to get this data using jQuery (you can use the class or id also)
    var formData = {
        'registerMode': data[0].value,
        'UserName': data[1].value,
        'UserEmail': data[2].value,
        'UserPassword': data[3].value
    };

    waitingDialog.show('Completando cadastro...');

    // process the form
    $.ajax({
        type: 'POST', 
        url: '../wa/api/register/', 
        data: formData, 
        dataType: 'json', 
        encode: true,
    })
    // using the done promise callback
    .done(function(data) {
        // log data to the console so we can see
        waitingDialog.hide();

        var title = "Nuvem",
            message = "Para concluir a ativação.\nVerifique seu e-mail e siga as instruções",
            typeAlert = BootstrapDialog.TYPE_SUCCESS;

        if(!data.success) {
            typeAlert = BootstrapDialog.TYPE_WARNING;
            title  = 'Alerta';
            message = (data.message === "User Exists") ? "Email já cadastrado" : "Erro ao registo";
        }

        BootstrapDialog.show({
            type: typeAlert,
            title: title,
            message: message,
            buttons: [{
                label: 'OK',
                action: function(dialog) {
                    dialog.close();
                    if(data.success)
                        location.reload();
                }
            }]
        });
    })
    // if fail
    .fail(function(data) {
        waitingDialog.hide();
    });
}

/**
 * Module for displaying "Waiting for..." dialog using Bootstrap
 *
 * @author Eugene Maslovich <ehpc@em42.ru>
 **/
var waitingDialog = waitingDialog || (function($) {
    'use strict';

    // Creating modal dialog's DOM
    var $dialog = $(
        '<div class="modal fade" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-hidden="true" style="padding-top:15%; overflow-y:visible;">' +
        '<div class="modal-dialog modal-m">' +
        '<div class="modal-content">' +
        '<div class="modal-header"><h3 style="margin:0;"></h3></div>' +
        '<div class="modal-body">' +
        '<div class="progress progress-striped active" style="margin-bottom:0;"><div class="progress-bar" style="width: 100%"></div></div>' +
        '</div>' +
        '</div></div></div>');

    return {
        /**
         * Opens our dialog
         * @param message Custom message
         * @param options Custom options:
         *                options.dialogSize - bootstrap postfix for dialog size, e.g. "sm", "m";
         *                options.progressType - bootstrap postfix for progress bar type, e.g. "success", "warning".
         */
        show: function(message, options) {
            // Assigning defaults
            if (typeof options === 'undefined') {
                options = {};
            }
            if (typeof message === 'undefined') {
                message = 'Loading';
            }
            var settings = $.extend({
                dialogSize: 'm',
                progressType: '',
                onHide: null // This callback runs after the dialog was hidden
            }, options);

            // Configuring dialog
            $dialog.find('.modal-dialog').attr('class', 'modal-dialog').addClass('modal-' + settings.dialogSize);
            $dialog.find('.progress-bar').attr('class', 'progress-bar');
            if (settings.progressType) {
                $dialog.find('.progress-bar').addClass('progress-bar-' + settings.progressType);
            }
            $dialog.find('h3').text(message);
            // Adding callbacks
            if (typeof settings.onHide === 'function') {
                $dialog.off('hidden.bs.modal').on('hidden.bs.modal', function(e) {
                    settings.onHide.call($dialog);
                });
            }
            // Opening dialog
            $dialog.modal();
        },
        /**
         * Closes dialog
         */
        hide: function() {
            $dialog.modal('hide');
        }
    };

})(jQuery);

$(document).ready(function() {
    $('.nav li a').bind('click', function (event) {
        var $anchor2 = $(this).parent();
        var $anchor = $(this);
        $('.nav  li').removeClass('active');
        $anchor2.addClass('active');

        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top - 80
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });

    $('#formRegister').validator().on('submit', function (e) {
        if (e.isDefaultPrevented()) {
            // handle the invalid form...
        } else {
            // everything looks good!
            var data = $("#formRegister").serializeArray();
            completedRegister(data);
        }

        // stop the form from submitting the normal way and refreshing the page
        e.preventDefault();
    });

    $(window).scroll(function() {
        if ($(this).scrollTop() > 800) {
            $('.scrollup').fadeIn();
        } else {
            $('.scrollup').fadeOut();
        }
    });

    $('.scrollup').click(function() {
        $("html, body").animate({
            scrollTop: 0
        }, 600);
        return false;
    });

    $('#btnLogin').click(function() {
        var uid = $("#txtUID").val(),
            pwd = $("#txtPWD").val();

        var record = {
            data: {
                UserEmail: uid,
                UserPassword: pwd
            }
        };

        waitingDialog.show('Començando sessão...');

        $.ajax({
            type: "POST",
            url: "../wa/api/auth",
            data: record,
            success: function(response) {
                var d = new Date();
                //var expiry = new Date(now.getTime()+(24*3600*1000)); // Ten minutes
                var expiry = new Date(d.setHours(23, 59, 59, 999)); // at end of day
                var result = response;

                setCookie('Nuvem.AppAuth', result.security, expiry);
                setCookie('Nuvem.CurrentUser', JSON.stringify(result.data), expiry);

                waitingDialog.hide();

                checkIfLogged();
            }

            /*BootstrapDialog.TYPE_DEFAULT, 
            BootstrapDialog.TYPE_INFO, 
            BootstrapDialog.TYPE_PRIMARY, 
            BootstrapDialog.TYPE_SUCCESS, 
            BootstrapDialog.TYPE_WARNING, 
            BootstrapDialog.TYPE_DANGER*/

        }).fail(function() {
            waitingDialog.hide();
            BootstrapDialog.show({
                type: BootstrapDialog.TYPE_WARNING,
                title: "Alerta",
                message: 'Usuário Inválido. Tente novamente',
                buttons: [{
                    label: 'OK',
                    action: function(dialog) {
                        dialog.close();
                    }
                }]
            });
        });

        return false;
    });
});