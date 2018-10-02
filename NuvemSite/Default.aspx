﻿<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="_Default" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta charset="utf-8" />
    <title>Nuvem</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
    <link href='http://fonts.googleapis.com/css?family=Lato' rel='stylesheet' type='text/css' />
    <link rel="SHORTCUT ICON" href="app/images/logo_icono.ico" type="image/x-icon" />
    <link rel="stylesheet" href="assets/css/app.css" />
    <!-- Latest compiled and minified CSS -->
    <link rel="stylesheet" href="css/bootstrap.min.css" />
    <link href="js/bootstrap3-dialog-master/dist/css/bootstrap-dialog.min.css" rel="stylesheet" type="text/css" />

    <!--==============GOOGLE FONT - OPEN SANS=================-->
    <link href="http://fonts.googleapis.com/css?family=Montserrat:400,700" rel="stylesheet" type="text/css"/>
    <!--==============MAIN CSS=================-->
    <link href="css/hosting.css" rel="stylesheet" media="all" />
    <link href="assets/css/main.css" rel="stylesheet" />
</head>
<body id="home" data-spy="scroll" data-target=".navbar-collapse" data-offset="100">
    <!--==============Logo & Menu Bar=================-->
    <nav class="navbar navbar-default navbar-fixed-top" role="navigation">
        <!-- Brand and toggle get grouped for better mobile display -->
        <div class="container">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse"><span class="sr-only">Menú</span> <span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button>
                <a class="navbar-brand logo_un_toque_mas_chico" href="#">
                    <img src="images/logo_header.png" alt="logo"></a>
            </div>
            <!-- Collect the nav links, forms, and other content for toggling -->
            <div class="collapse navbar-collapse navbar-ex1-collapse">
                <ul class="nav navbar-nav navbar-right">
                    <li class="item active"><a href="<%=ResolveUrl("~/Default.aspx") %>">Home</a></li>
                    <li class="hidden-sm"><a href="about.html">Quem Somos</a></li>
                    <li><a href="#">Parceiros</a></li>
                    <li>
                        <div class="sep5"></div>
                        <form class="form-inline" role="form">
                            <div class="form-group">
                                <input type='email' id="txtUID" class="form-control" placeholder="Email"></input>
                            </div>
                            <div class="form-group">
                                <input type='password' id="txtPWD" placeholder="Palavra passe" class="form-control"></input>
                            </div>
                            <!-- <button class="large-btn-little">Entrar</button> -->
                            <input type="submit" class="btn btn-success" id="btnLogin" value="Entrar"></button>
                        </form>
                    </li>
                </ul>
            </div>
            <!-- /.navbar-collapse -->
        </div>
    </nav>
    <!--==============Body=================-->
    <div class="sep60"></div>
    <div class="sep40"></div>
    <div class="container">
        <div class="row">
            <div class="col-sm-12 col-md-6">
                <h1 style="text-shadow: none; color: #5F5F5F;">Primeiros Passos</h1>
                <iframe width="100%" height="380" src="https://www.youtube.com/embed/xXeb-TaGQM0" frameborder="0" allowfullscreen></iframe>
            </div>
            <div class="col-sm-12 col-md-6">
                <h1 style="text-shadow: none; color: #5F5F5F;">Cadastrar</h1>
                <form data-toggle="validator" role="form" id="formRegister">
                    <div class="form-group">
                        <label>Registe-me como&nbsp;&nbsp;&nbsp;&nbsp;</label>
                        <label>
                            <input type="radio" name="registerMode" checked="checked" value="purchaser" />Comprador
                        </label>
                        <label>
                            <input type="radio" name="registerMode" value="vendor" />&nbsp;Fornecedor
                        </label>
                    </div>
                    <div class="form-group">
                        <input type="text" name="UserName" placeholder="Nome" class="form-control" data-error="Campo Obrigatório" autofocus required>
                        <div class="help-block with-errors"></div>
                    </div>
                    <div class="form-group">
                        <input type="email" name="UserEmail" placeholder="Email" class="form-control" data-error="Email inválido" required>
                        <div class="help-block with-errors"></div>
                    </div>
                    <div class="form-group">
                        <input type="password" data-minlength="6" data-minlength-error="Mínimo de 6 caracteres" data-error="Campo Obrigatório" name="UserPassword" id="UserPassword" placeholder="Palavra passe" class="form-control" required>
                        <span class="help-block with-errors"></span>
                    </div>
                    <div class="form-group">
                        <input type="password" name="UserPasswordRetype" placeholder="Repetir palavra passe" class="form-control" data-match="#UserPassword" data-match-error="Senha não coincidem" data-error="Campo Obrigatório" required>
                        <div class="help-block with-errors"></div>
                    </div>
                    <div class="form-group">
                        <input type='submit' class="large-btn" id="btnRegister" style="margin: auto auto;" value="Registre-se"></input>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <!--============== Footer ==============-->
    <div class="sep60"></div>
    <div class="sep10"></div>
    <div class="footer col-md-12">
        <div class="container">
            <div class="row footerlinks">
                <div class="col-sm-4 col-md-2">
                    <p>Fale Conosco</p>
                    <ul>
                        <li><a href="skype:userskype?call">By Skype</a></li>
                        <li>Tel. 00 0 555-555 </li>
                        <li>Cel. 00 0 555-555 </li>
                    </ul>
                </div>
                <div class="col-sm-4 col-md-2">
                    <p>Redes Sociais</p>
                    <a href="#" target="_blank">
                        <img src="images/social-03.png" alt="logo" /></a>
                    <a href="#" target="_blank">
                        <img src="images/social-04.png" alt="logo" /></a>
                    <a href="#" target="_blank">
                        <img src="images/social-02.png" alt="logo" /></a>
                </div>
                <div class="col-sm-4 col-md-2">
                    <p>Empresa</p>
                    <ul>
                        <li><a href="quienes_somos.html" target="_blank">Quem Somos</a></li>
                    </ul>
                </div>
                <div class="col-sm-4 col-md-2">
                    <p>Envie-nos</p>
                    <ul>
                        <li><a href="mailto:info@empresa.com" target="_blank">info@company.com</a></li>
                        <li><a href="mailto:sales@empresa.com" target="_blank">sales@company.com</a></li>
                    </ul>
                </div>
                <div class="col-sm-4 col-md-2">
                    <p>Termos e condições</p>
                    <ul>
                        <li><a href="terminos_y_condiciones.html">Termos e condições</a></li>
                        <li><a href="terminos_y_condiciones.html">Política de privacidade</a></li>
                    </ul>
                </div>
                <div class="col-sm-4 col-md-2">
                    <p>Contato</p>
                    <ul>
                        <li class="active"><a href="contacto.html">Contato</a></li>
                    </ul>
                </div>
            </div>
            <div class="row copyright">
                <div class="pull-right">
                    <img src="images/logo_white.png" alt="logo"></div>
                <p>© 2015 Nuvem B2B ® Todos os Direitos reservados</p>
            </div>
        </div>
    </div>
    <!--===Back to top======-->
    <a href="#" class="scrollup">Scroll</a>
    <!--===jQuery library======-->
    <script src="js/jquery.min.js"></script>
    <!-- Latest compiled Bootstrap JavaScript -->
    <script src="js/bootstrap.min.js"></script>
    <!--==============Mordernizr =================-->
    <script src="js/modernizr.js"></script>
    <script src="js/bootstrap3-dialog-master/dist/js/bootstrap-dialog.min.js"></script>
    <script src="js/bootstrap-validator-master/dist/validator.min.js"></script>
    <script src="js/jquery.easing.1.2.js"></script>
    <!--==============SIGNAL R CHAT and Notifications=================-->
    <script type="text/javascript" src="Scripts/jquery.signalR-2.2.0.js"></script>
    <%--<script type="text/javascript" src="/signalr/hubs"></script>--%>
    <script src="js/site.js"></script>
</body>
</html>