import express from 'express';
import path from 'path';
import session from 'express-session';
import cookieParser from 'cookie-parser';

const host = '0.0.0.0';
const porta = 3000;
let listaUsuarios = [];

const app = express();
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'MinH4Ch4v3S3cr3t4',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 15
    }
}));

app.use(cookieParser());

function usuarioEstaAutenticado(req, resp, next){
    if(req.session.usuarioAutenticado){
        next();
    }
    else{
        resp.redirect('/login.html');
    }
}

function gerarFormularioCadastro(res, nome = '', sobrenome = '', usuario = '', cidade = '', estado = '', cep = '', erros = {}) {
    let htmlresposta = `<!DOCTYPE html>
    <html lang="pt-br">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Página de Cadastro Usuários</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
            integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
        <style>
            .container {
                border: 2px solid rgb(173, 208, 196);
                border-radius: 25px;
                background-color: rgb(173, 208, 196);
                font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
            }

            .btn-primary {
                background-color: green;
                border: green;
            }

            .form-group .alert {
                margin-top: 0.5rem;
                padding: 0.5rem;
            }
        </style>
    </head>
    <body>
        <div class="container border mt-5">
            <form method="POST" action='/cadastrarUsuario' class="row g-3'>
                <legend style="text-align: center; margin-top: 30px;">Cadastro de Usuários</legend>`;

    // Campo Nome
    htmlresposta += `
        <div class="col-md-4">
            <div class="form-group">
                <label for="nome" class="form-label">Nome:</label>
                <input type="text" class="form-control" id="nome" name="nome" value="${nome}">
            </div>
            ${erros.nome ? '<div class="alert alert-danger mt-1" role="alert">Por favor informe o nome do usuário.</div>' : ''}
        </div>`;

    // Campo Sobrenome
    htmlresposta += `
        <div class="col-md-4">
            <div class="form-group">
                <label for="sobrenome" class="form-label">Sobrenome:</label>
                <input type="text" class="form-control" id="sobrenome" name="sobrenome" value="${sobrenome}">
            </div>
            ${erros.sobrenome ? '<div class="alert alert-danger mt-1" role="alert">Por favor informe o sobrenome do usuário.</div>' : ''}
        </div>`;

    // Campo Nome de Usuário
    htmlresposta += `
        <div class="col-md-4">
            <div class="form-group">
                <label for="usuario" class="form-label">Nome do usuário:</label>
                <div class="input-group has-validation">
                    <span class="input-group-text" id="inputGroupPrepend">@</span>
                    <input type="text" class="form-control" id="usuario" name="usuario" value="${usuario}" aria-describedby="inputGroupPrepend">
                </div>
            </div>
            ${erros.usuario ? '<div class="alert alert-danger mt-1" role="alert">Por favor informe o nome de login do usuário.</div>' : ''}
        </div>`;

    // Campo Cidade
    htmlresposta += `
        <div class="col-md-6">
            <div class="form-group">
                <label for="cidade" class="form-label">Cidade:</label>
                <input type="text" class="form-control" id="cidade" name="cidade" value="${cidade}">
            </div>
            ${erros.cidade ? '<div class="alert alert-danger mt-1" role="alert">Por favor informe a cidade.</div>' : ''}
        </div>`;

    // Campo Estado
    htmlresposta += `
        <div class="col-md-3">
            <div class="form-group">
                <label for="estado" class="form-label">UF:</label>
                <select class="form-select" id="estado" name="estado">
                    <option selected disabled value="">Escolha um estado</option>
                    <option value="AC" ${estado === 'AC' ? 'selected' : ''}>AC</option>
                    <option value="AL" ${estado === 'AL' ? 'selected' : ''}>AL</option>
                    <option value="AP" ${estado === 'AP' ? 'selected' : ''}>AP</option>
                    <option value="AM" ${estado === 'AM' ? 'selected' : ''}>AM</option>
                    <option value="BA" ${estado === 'BA' ? 'selected' : ''}>BA</option>
                    <option value="CE" ${estado === 'CE' ? 'selected' : ''}>CE</option>
                    <option value="DF" ${estado === 'DF' ? 'selected' : ''}>DF</option>
                    <option value="ES" ${estado === 'ES' ? 'selected' : ''}>ES</option>
                    <option value="GO" ${estado === 'GO' ? 'selected' : ''}>GO</option>
                    <option value="MA" ${estado === 'MA' ? 'selected' : ''}>MA</option>
                    <option value="MT" ${estado === 'MT' ? 'selected' : ''}>MT</option>
                    <option value="MS" ${estado === 'MS' ? 'selected' : ''}>MS</option>
                    <option value="MG" ${estado === 'MG' ? 'selected' : ''}>MG</option>
                    <option value="PA" ${estado === 'PA' ? 'selected' : ''}>PA</option>
                    <option value="PB" ${estado === 'PB' ? 'selected' : ''}>PB</option>
                    <option value="PR" ${estado === 'PR' ? 'selected' : ''}>PR</option>
                    <option value="PE" ${estado === 'PE' ? 'selected' : ''}>PE</option>
                    <option value="PI" ${estado === 'PI' ? 'selected' : ''}>PI</option>
                    <option value="RJ" ${estado === 'RJ' ? 'selected' : ''}>RJ</option>
                    <option value="RN" ${estado === 'RN' ? 'selected' : ''}>RN</option>
                    <option value="RS" ${estado === 'RS' ? 'selected' : ''}>RS</option>
                    <option value="RO" ${estado === 'RO' ? 'selected' : ''}>RO</option>
                    <option value="RR" ${estado === 'RR' ? 'selected' : ''}>RR</option>
                    <option value="SC" ${estado === 'SC' ? 'selected' : ''}>SC</option>
                    <option value="SP" ${estado === 'SP' ? 'selected' : ''}>SP</option>
                    <option value="SE" ${estado === 'SE' ? 'selected' : ''}>SE</option>
                    <option value="TO" ${estado === 'TO' ? 'selected' : ''}>TO</option>
                </select>
            </div>
            ${erros.estado ? '<div class="alert alert-danger mt-1" role="alert">Por favor informe o estado.</div>' : ''}
        </div>`;

    // Campo CEP
    htmlresposta += `
        <div class="col-md-3">
            <div class="form-group">
                <label for="cep" class="form-label">CEP:</label>
                <input type="text" class="form-control" id="cep" name="cep" value="${cep}">
            </div>
            ${erros.cep ? '<div class="alert alert-danger mt-1" role="alert">Por favor informe o CEP.</div>' : ''}
        </div>`;

    // Botões
    htmlresposta += `
        <div class="col-12 mb-3">
            <button class="btn btn-primary" type="submit">Cadastrar</button>
            <a class="btn btn-secondary" href="/">Voltar</a>
        </div>
    </form>
</div>
</body>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
crossorigin="anonymous"></script>
</html>
`;

    res.send(htmlresposta);
}

function autenticarUsuario(req, resp){
    const usuario = req.body.usuario;
    const senha = req.body.senha;
    if(usuario == 'admin' && senha == '123'){
        req.session.usuarioAutenticado = true;
        resp.cookie('dataUltimoAcesso', new Date().toLocaleString(), 
        {httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 30
        });
        resp.redirect('/');
    }
    else{
        resp.write('<!DOCTYPE html>');
        resp.write('<html>');
        resp.write('<head>');
        resp.write('<meta charset="utf-8">');
        resp.write('<title>Falha ao realizar login</title>');
        resp.write('</head>');
        resp.write('<body>');
        resp.write('<p>Usuário ou senha inválidos!</p>');
        resp.write('<a href="/login.html">Voltar</a>');
        //resp.write('<input type="button" value="Voltar" onclick="history.go(-1)"/>');
        if (req.cookies.dataUltimoAcesso){
            resp.write('<p>');
            resp.write('Seu último acesso foi em ' + req.cookies.dataUltimoAcesso);
            resp.write('</p>');
         }
        resp.write('</body>');
        resp.write('</html>');
        resp.end();
    }
}


function cadastrarUsuario(req, res) {
    const nome = req.body.nome;
    const sobrenome = req.body.sobrenome;
    const usuario = req.body.usuario;
    const cidade = req.body.cidade;
    const estado = req.body.estado;
    const cep = req.body.cep;

    let erros = {};

    if (!nome || nome.trim() === "") {
        erros.nome = true;
    }
    if (!sobrenome || sobrenome.trim() === "") {
        erros.sobrenome = true;
    }

    if (!usuario || usuario.trim() === "") {
        erros.usuario = true;
    }

    if (!cidade || cidade.trim() === "") {
        erros.cidade = true;
    }

    if (!estado || estado.trim() === "") {
        erros.estado = true;
    }

    if (!cep || cep.trim() === "") {
        erros.cep = true;
    }

    if (Object.keys(erros).length > 0) {
        gerarFormularioCadastro(res, nome, sobrenome, usuario, cidade, estado, cep, erros);
    } else {
        listaUsuarios.push({ nome, sobrenome, usuario, cidade, estado, cep });
        res.redirect('/listarUsuarios');
    }
}

function listarUsuarios(req, res) {
    let htmlresposta = `<!DOCTYPE html>
    <html lang="pt-br">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Lista de Usuários</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
            integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    </head>
    <body>
        <div class="container border mt-5">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">Nome</th>
                        <th scope="col">Sobrenome</th>
                        <th scope="col">Usuário</th>
                        <th scope="col">Cidade</th>
                        <th scope="col">UF</th>
                        <th scope="col">CEP</th>
                    </tr>
                </thead>
                <tbody>`;

    listaUsuarios.forEach(usuario => {
        htmlresposta += `
                    <tr>
                        <td>${usuario.nome}</td>
                        <td>${usuario.sobrenome}</td>
                        <td>${usuario.usuario}</td>
                        <td>${usuario.cidade}</td>
                        <td>${usuario.estado}</td>
                        <td>${usuario.cep}</td>
                    </tr>`;
    });

    htmlresposta += `
                </tbody>
            </table>
            <a class="btn btn-primary" href="/">Voltar</a>
        </div>`;

    if (req.cookies.dataUltimoAcesso) {
        htmlresposta += `<p>Seu último acesso foi em ${req.cookies.dataUltimoAcesso}</p>`;
    }

    htmlresposta += `
    </body>
    </html>`;

    res.send(htmlresposta);
}


app.post('/login', autenticarUsuario);

app.get('/login', (req,resp) => {
    resp.redirect('login.html');
});

app.get('/logout', (req, resp) => {
    req.session.destroy();
    resp.redirect('/login.html');
});

app.use(express.static(path.join(process.cwd(), 'publico')));
app.use(usuarioEstaAutenticado, express.static(path.join(process.cwd(), 'protegido')));

app.get('/', (req, res) => {
    gerarFormularioCadastro(res);
});

app.post('/cadastrarUsuario', usuarioEstaAutenticado, cadastrarUsuario);
app.get('/listarUsuarios', usuarioEstaAutenticado, listarUsuarios);

app.listen(porta, host, () => {
    console.log(`Servidor rodando em http://${host}:${porta}`);
});