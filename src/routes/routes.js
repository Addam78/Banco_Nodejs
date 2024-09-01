

const express = require('express')
const router = express.Router();
const mysql = require('mysql2')
const flash = require('connect-flash');

//CONST CRIADA PARA REFERENCA A CONTROLLERS

const logicas = require('../controllers/logica')


const conexao = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});


//COSNT LOGIA DE ROUTES . EXPORTS DE CONTROLLERS

//ROTA PRINCIPAL
router.get('/', logicas.logica_banco);


//ROTA PARA REALIZAR CADASTRO
router.get('/cadastrar', logicas.logica_banco_cadastro)


//VALIDAR CADASTRO
router.post('/validar_cadastro', logicas.logica_banco_validar_cadastro);


//VERIFICAR LOGIN
router.post('/verifica', logicas.logica_banco_validar_login);


//ROTA PARA IR PARA PAGINA INICIAL
router.get('/principal', logicas.logica_banco_inicio)



router.get('/teste', logicas.logica_banco_teste)

//RESPONSAVEL POR RECEBER O VALOR INSERIDO PELO MODO POST E VALIDAR
router.post('/inserir_nota', logicas.logica_banco_recebe_inserção);


//ROTA PARA IR PARA O TEMPLATE DERETIRADA DE DINHEIRO
router.get('/sacar', logicas.logica_banco_nsei)


// //ROTA PARA VALIDAR  RETIRADA DO DINHEIRO
router.post('/sacar_dinheiro', logicas.logica_banco_retira_dinheiro)


//ROTA PARA EXECUTAR PAGAMENTOS ---LEMBRAR DE UTILIZAR O CAMPO DESCRIÇÃO -- // UTILZIAR  O MESMO CAMPO DE RETIRADA
router.get('/pagamento', logicas.logica_banco_pagamento)

//CRIAR LOGICA PARA ROTA DE VERIFICAÇÃO DE PAGAMENTO
router.post('/verifica_pagamento', logicas.logica_banco_verifica_pagamento)


//EXIBIR TODOS USUARIOS
router.get('/listagem', logicas.logica_banco_listagem)


router.get('/historicoprincipal', (req,res) =>{
    res.render('historico_main')
})

router.get('/consulta_deposito', (req, res) => {

    if (!req.session.userId) {
        return res.status(401).send('Usuário não autenticado');
    }

    let id = req.session.userId
    console.log(id)

    let sql = `SELECT deposito, data_criacao from CONTA WHERE id  = ${id} and deposito is not null order by data_criacao desc`

    conexao.query(sql, function (erro, retorno) {
        res.render('historico_deposito', { historico_deposito: retorno })
    })
}

)

router.get('/consulta_saque', (req, res) => {

    if (!req.session.userId) {
        return res.status(401).send('Usuário não autenticado');
    }

    let id = req.session.userId
    console.log(id)

    let sql = `SELECT retirada, descricao, data_criacao from CONTA WHERE id  = ${id} and retirada is not null order by data_criacao desc`

    conexao.query(sql, function (erro, retorno) {
        res.render('historico_saque', { historico_saque: retorno })
    })
}

)


module.exports = router;
