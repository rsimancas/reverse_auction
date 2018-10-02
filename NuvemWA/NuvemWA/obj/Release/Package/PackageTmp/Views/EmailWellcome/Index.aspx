<style>
    a:hover,
    a:focus {
        color: #f58d37;
        text-decoration: none;
        transition: all 500ms ease;
        cursor: pointer;
    }

    a:active,
    a:hover {
        outline: 0;
    }

    p {
        font-size: 14px;
        text-align: center;
        color: black;
        margin: 0 0 10px;
        display: block;
        -webkit-margin-before: 1em;
        -webkit-margin-after: 1em;
        -webkit-margin-start: 0px;
        -webkit-margin-end: 0px;
        font-family: "Montserrat", Arial, Helvetica, sans-serif;
    }

    .container {
        margin: 75px 15% 50px 15%;
    }

    .well {
        background-color: #f5f5f5;
        border: 1px solid #e3e3e3;
        -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .05);
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, .05);
    }

    .well-white {
        background-color: #ffffff;
        border: 1px solid #e3e3e3;
        -webkit-box-shadow: 3px 3px 3px rgba(0, 0, 0, .05);
        box-shadow: 3px 3px 3px rgba(0, 0, 0, .05);
        margin: 2% 22% 0px 22%;
    }

    .navbar {
        position: relative;
        min-height: 60px;
        margin-bottom: 20px;
        border: 1px solid transparent;
        background-color: black;
        margin: 2% 22% 0px 22%;
    }

    .row {
        margin: 20px 50px 0px 50px;
    }

    .padd-60 {
        margin-top: 60px;
    }

    .text-center {
        text-align: center;
    }

    .btn {
        display: inline-block;
        padding: 6px 12px;
        margin-bottom: 0;
        font-size: 14px;
        font-weight: normal;
        line-height: 1.42857143;
        text-align: center;
        white-space: nowrap;
        vertical-align: middle;
        -ms-touch-action: manipulation;
        touch-action: manipulation;
        cursor: pointer;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        background-image: none;
        border: 1px solid transparent;
        border-radius: 4px;
    }

        .btn:focus,
        .btn:active:focus,
        .btn.active:focus,
        .btn.focus,
        .btn:active.focus,
        .btn.active.focus {
            outline: thin dotted;
            outline: 5px auto -webkit-focus-ring-color;
            outline-offset: -2px;
        }

        .btn:hover,
        .btn:focus,
        .btn.focus {
            color: #333;
            text-decoration: none;
        }

        .btn:active,
        .btn.active {
            background-image: none;
            outline: 0;
            -webkit-box-shadow: inset 0 3px 5px rgba(0, 0, 0, .125);
            box-shadow: inset 0 3px 5px rgba(0, 0, 0, .125);
        }

    .btn-primary {
        color: #fff;
        background-color: #337ab7;
        border-color: #2e6da4;
    }

        .btn-primary:focus,
        .btn-primary.focus {
            color: #fff;
            background-color: #286090;
            border-color: #122b40;
        }

        .btn-primary:hover {
            color: #fff;
            background-color: #286090;
            border-color: #204d74;
        }

        .btn-primary:active,
        .btn-primary.active,
        .open > .dropdown-toggle.btn-primary {
            color: #fff;
            background-color: #286090;
            border-color: #204d74;
        }

            .btn-primary:active:hover,
            .btn-primary.active:hover,
            .open > .dropdown-toggle.btn-primary:hover,
            .btn-primary:active:focus,
            .btn-primary.active:focus,
            .open > .dropdown-toggle.btn-primary:focus,
            .btn-primary:active.focus,
            .btn-primary.active.focus,
            .open > .dropdown-toggle.btn-primary.focus {
                color: #fff;
                background-color: #204d74;
                border-color: #122b40;
            }

        .btn-primary:active,
        .btn-primary.active,
        .open > .dropdown-toggle.btn-primary {
            background-image: none;
        }

    .btn-success:hover {
        background-color: #f58d37;
        border-color: #f58d37 !important;
        background-image: none;
    }

    .btn-success {
        color: #fff;
        background-color: #f58d37;
        border-color: #f58d37;
    }

    .center-block {
        display: block;
        margin-right: auto;
        margin-left: auto;
    }

    #logo {
        margin: 5px 0px 0px 5px;
    }
</style>

<div class="well container">
    <nav class="navbar" style="margin-top:0%;">
        <!-- Brand and toggle get grouped for better mobile display -->
        <div>
            <a href="#"> <img style="margin:10px 15px 10px 15px;" src="data:image/png;base64,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" alt="logo"></a>
            <!-- /.navbar-collapse -->
        </div>
    </nav>
    <div class="row">
        <div class="well-white">
            <iframe width="100%" height="250px" src="https://www.youtube.com/embed/xXeb-TaGQM0" frameborder="0" allowfullscreen></iframe>
            <div class="row">
                <p>
                    A partir de agora você pode trabalhar de forma mais eficaze em parceria com as melhores Empresas do Mercado
                </p>
                <div style="margin-bottom: 5%">
                    <a href="<%=ResolveUrl("../../../site/Default.aspx")%>" class="btn btn-primary center-block">Vamos a começar</a>
                </div>
            </div>
        </div>
        <div class="well-white">
            <div class="row">
                <p>
                    Com o Nuvem B2B, sua empresa pode funcionar de forma mais inteligente e rápida, lhe auxiliando para que ganhe mais tempo em seu dia a dia
                </p>
            </div>
            <div class="row">
                <p>
                    Para aproveitar ao máximo e experimentar todos os recursos disponíveis do sistema Nuvem B2B, inicie o preenchimento de todos os dados da sua Empresa <a href="<%=ResolveUrl("../../../site/Default.aspx") %>" class="btn btn-success center-block">clicando aqui.</a>
                </p>
            </div>
            <div class="row">
                <p>Efetue cotações de qualquer lugar do mundo, em poucos segundos</p>
                <p>Organize-se e siga uma programação de compras, antecipando as suas demandas</p>
                <p>Encontre fornecedores em todas as regiões do Brasil.</p>
            </div>
            <div class="row">
                <p>
                    Não se esqueça de que nossa equipe de suporte está disponível para ajudá-lo. Nosso canal de atendimento é <a href="mailto:suporte@nuvemb2b.com.br" class="btn btn-primary center-block" target="_blank">suporte@nuvemb2b.com.br</a>
                </p>
            </div>
        </div>
        <div class="row">
            <p>
                Atenciosamente,
            </p>
            <p>
                Equipe Nuvem B2B
            </p>
            <div class="col-md-12">
                <p class="text-center">
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAkCAYAAACe0YppAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAFTSURBVFhH7ZW/SsRAEIdTWtgo1p6+gI2lRUQ0u6uNIFqIcmY3WNwLKFhYCFZiY2EjZDZwFrY+gc9gI9iLhaAgoh6izh4jyN6Ws9XtBz8SMjN8yeZflkgkHMrAnDAWpLa30thH3D5R7qiFn0LDmjL2JxQUf1MbL3nnajQk/Ate/Su18iI0bISE//JBrbzgUh76Mjx27e55UcGsrOwMtfIiDRz7YrXTLFA5HkrbPV8sTD1PZX4Wt5tJ0a6nUHTmi/GB6iybbmupaqZdaIQHqeHZF4aCJ/FAIzzgEn+FRH5QfE8jPIQkoaD4hkZ4cEuIr8wbPtW9AZm2n/2ahnfcP6cRHlY2u2PCXIwrDSe+WJRQulq+ezmRt+sRGuFF6mbfF+PJFFSOhzTNkS/GY+tUjkcSJ3E0hlEMpwPi0m5ROR6yhAP8br+432Q/uK9MvUrlRGKoybJfzEOHxKsWyq4AAAAASUVORK5CYII=" alt="Not Found">
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAkCAYAAACe0YppAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAKkSURBVFhH7ZY7aFNhHMXjo7r4GAQdfYCg1MlB8EWgiINV1CE+CITmHWNTEHETgk71UVEQFJ0EB7GTOnRxEQSdhAbaTQvaRUFodRFF6+/Ec2NC0xjTZmoOHL7vO//z///vd2/udxPqoIPFiUwm05VKpW6k0+kncJz1DPzG/DPjBOMnxknG/kKhsNJpyrsAp9CPW2oeyWRyL8lf4XN4jAvoodAQczUXFetF63ZKBXivyMMYs9Qc4vH4FiVS9K2lCtASbqz4Pcs1IHbGnn2WmgMF3yiRKz5kqQbExlx4JpFI7CgWi0vJOcy6VznMHyrGOOi1YgedXh8YdirJiXss14DYQJWnL5/PrwrWjej0+qBQf2BkXvfHoV1WeW5GIpEVzK+LrK/Bl44909qxy06vD4x5JZm3LNcgFoutI/ZTHvxDlitAyyqWzWZ3W/o3+DVvd1MVnUZa8ifyF9FodE3ggdssV0DeJcV4vqctNQcSh4PCzO9YrgDtlGOzdisQu+p4n6XmEA6Hl5Oo9zfY1WOKdPMsl3FHdlm7b/ss4NnIbntyudx6S/8HiqfgCzcq0fyD509taT9opmOwfAfYzX7L7QfNCkFjdv5Kh4ZD7QcN9XEoN4clPUuHFhY0OsBO9XUaNt9XNdbOv/CubrV9/qDoSfgR6gs0QoOLjBGdWDQ6wnwSBhcgX5dTWwdFbqsgzcbZ7QbLNeACVhMvH4uinr9DrYEiERebstQQ+Cbsn9/rxS5GVYjxgaWGwBt34xFLrYGGv1yoqR34X4r8RUutgcbvXOg7z22z5TmB75H9ay21BhqfcCHdbh2Pc/51IX7Ovqil+YFi5yn2I7gAWIL6kJ9VM3iX+RjjNHflqNMWBryrmyhehK9hcAHlAwOOwkF9wWzvoINFjVDoN55Vw+lmQbuEAAAAAElFTkSuQmCC" alt="Not Found">
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAkCAYAAACe0YppAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAHESURBVFhH7ZTPKwVRFMdPVmQjdhaKspL8SInYkVgoJWVpYWuJjbKhLCUlO9u5d54fye/4B1iQHdmwIHPPjBcrMc48x6959407j7Iwn/p258c9n9vcM11ISEhI+DsO/EKwcRaEugCpbin7YKt+fguQUp0gsYbvvkGqRZrcyne5WXZLaMEzmu9nRah5GrdoPATLL+KKCIJJr8UPYGEFP9Uj1Mr7QjmDY5QerohgOV1GBU9c6ILAbn7zlVWn/EOeM/cUh7a+i6si8P0Cmnz9qZi2zVnK6pPl1n+Zo4tQHkivgSsMkDieQ7RB4wjIuyaw3V66ftsZfYSzx0YDrLtS7vMaJUr8SHkOPQsFd9lqQNA7oU6ot9tUHMg1QsMItcBWQwReaUWxg8NsNMTCNr0oZmyvio0xsFUfFR9R8t3uYzbFZMcvph7NkOAmJDQMDrIpJhbW6oVGuWRLnkgc0EhN0syGHxCcUEJNkuw0JNdH4ChX/gKWV0nS4EfTL/YenOOKPJDpavqjO0C67fSlQyTczF5Amwk25EnKrSPJekgaEdyh8Rd6+oaFLXTIT2cOeqnO6esVjU7mOjiDbZyClNfIsxMSEv4dAC/dP9HLVN6mqwAAAABJRU5ErkJggg==" alt="Not Found">
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAkCAYAAACe0YppAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAOZSURBVFhH7ZZLbExRGMcnwsLCqyHxKKVGp517r+nMTWxE2AmxsLFBYiGReKxoJBILlh4hiFh4JCIe8QhapBGUUETuPFoqGmmblka90nrVW/2+c8/tTEdniGnZ9J/8c77zP+d83/nueV3fAAbwXxAPGXOiEfNjImTMlLpjmy+pn1KN/Ykun29w1La6YmFzm9TFjkasJaqxv0GG5TBB8LUSWLRYOOgn+wuxsLFe6o5dPA5785P8/KGOHVzs2MZK0XNCIlQSdjM1v8ODopH1e+xW0R3bWhQLlxSIHS/1j0F/AD+pwbmCQA3iuGZ60ZR4KDDZy5wA5WR+UzIWrS4YzEOrgDVqYK6IRowjXrB4qTk7JfAZeNnLuB8CmweTwYy5Sds6R1ulF7jWskZRP9+XgQ97wWJha14ysHmCidyWJUjR5Cs8FDtn4Oiy5zgRmjZBbLQDqgwbmx77/cO1dkyXdWpgriDLNRyRs7oqF8lC2AyPakkmJ2t7HO6TyWi570Dag7TZjd60v0K8tGQaM9/J5rkE72DHYR1sgk81sa0nlK1u3XpE+RBK31uwEm0P59zSbrPDO5N9SS4hQ7vPDGZ6Gn6FZXCLZhkzr013KOvOrt6drqczdS9kBEFewPu62g20il8dup8xXU8nge8qJ9kgQeEP+JkLf5I6PtiwE75TziLmW/iNbBdwW41lAl9w3tEjoL5mdf/fHy86NXoDuIkKvVsJx+uoB2jvfBQIDHM3nbXDsQtHSB91lnm70d7LOPHF9Tpfj+1QzrOBwW1eYHkQ7pvmRHdwcLH77JkfdL8q1ni7XJNkfFJr1XCDY9tDKNXtRVkp48XOCmb8vLfA6Cv0Z+90+6kjU5YIFRd5junD3W2skveatquiMdFdfxi494wzBN7Q85k0LspXEDseKhjJl1ikTgNLIFpW0Kmlt8D8YSzns+Yng1g35A+EQFOTmnqZlsZLg0Hlw/17aYTt0p4VdKpTg6DsWPVXgU2AZVInq+u63z0Cb5TNhd2ktau0r3b7mW9cLfmWZwUDqlIC5ynH2Pxz7ZV2b8eSsUPfrWLHwoHxrma+Zk2bxRY4dtFo2YzoLVrKDDru9wLr9alRdfcsX4FyT8fo1+HackerSVR746g30H4Urd2tG0e0+8zoXp8+JPd/RLvPjkQoOINZHmLW12CUmddTNlM+o5Sf+nbKDqHKKmK+gm2wBdbDGKyCh6ORklna7QAG8C/g8/0E3+fwWruXa8MAAAAASUVORK5CYII=" alt="Not Found">
                </p>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="row" style="margin: 2% 22% 0px 22%;">
            <p class="text-center">
                <small>Este e-mail é destinado apenas para envio de mensagens. Dessa forma, caso queira nos contatar, não responda para este e-mail - nós não receberemos sua mensagem. Utilize nosso suporte pelo e-mail:</small>
                <a href="mailto:suporte@nuvem2b2.com.br" class="btn btn-primary center-block">suporte@nuvemb2b.com.br.</a>
                <small>Obrigado</small>
            <p class="text-center">
                <small>Copyright © <%=DateTime.Now.Year()%> - Nuvem B2B. Todos os direitos reservados.</small>
            </p>
            </p>
        </div>
    </div>
</div>