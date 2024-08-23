const express = require('express')
const morgan  = require ('morgan')
const cors = require('cors')
const app = express()
const exphbs = require('express-handlebars');
const path = require('path');
const session = require('express-session');

//---------MYSQL-----------------//
const mysql = require('mysql2')
//CONFIGURAÇÃO_BASE_DADOS
const conexao = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'1234',
    database : 'FAITH'
    
})

//TESTE CONEXÃO
conexao.connect(function(erro){
    if(erro) throw erro;
    console.log('Conexão com suceso')

    
})

// Configuração do middleware de sessão
app.use(session({
    secret: 'seu-segredo', // Substitua por uma string secreta mais segura
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Use `true` se estiver usando HTTPS
  }));

//EXPORTANDO ARQUIVO ROTAS
const routes = require('./src/routes/routes')

//------- CONFIGURAÇÃO E DECLARAÇÃO BODYPARSER ----------//
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//------------CONFIGURAÇÃO E CELARAÇÃO HANDLEBARS--------------//
//Configurando handlebars
const handlebars = require('express-handlebars')
app.engine('handlebars', handlebars.engine({
  defaultLayout: 'main',
  runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
  },
}))
app.set('view engine', 'handlebars')

app.use(routes)
//definição da porta que o app vair rodar
app.listen(8084, () => {console.log(`Servidor rodando na porta http://localhost:8084/`)})
