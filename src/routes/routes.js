const express = require('express');
const router = express.Router(); 
const mysql = require('mysql2')

const conexao = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'1234',
    database : 'FAITH'
    
})

router.get('/', (req, res) => {
     res.render('registrar');
    //res.send('Ola')
    
});

router.get('/cadastrar', (req,res) =>{
    res.render('criar_login')
})

//VALIDAR CADASTRO
router.post('/validar_cadastro', (req,res) => {
    let nome= req.body.nome
    let senha = req.body.senha
    let cpf = req.body.CPF

    //CONSULTA SQL
    let sql = 'SELECT FROM * CLIENTE'
    //CONFERIR COM BANCO DE DADOS
    if (nome || senha || cpf != sql ){
        let sql = `INSERT INTO CLIENTE (NOME,SENHA,CPF) VALUES ('${nome}', '${senha}',' ${cpf}')`
        conexao.query(sql,function(erro, retorno){
            if(erro) throw erro
           })
    }
    else{
        return res.send('Usuario ja existente')
    }
  
})

//VERIFICAR LOGIN
router.post('/verifica', (req,res) => {

})

router.get('/teste', (req,res) =>{
    res.render('depositar')
})

router.post('/inserir_nota', (req, res) => {

   let deposito = req.body.inserir
   if (req.body.inserir >= 0){

    //QUERIE MYSQL
   let sql = `INSERT INTO TESTE (DEPOSITAR) VALUES (${deposito})`
    console.log(sql)
    //EXECUTAR COMANDO
    conexao.query(sql,function(erro, retorno){
        if(erro) throw erro
       })
    return res.send(`Deposito no valor de R$ ${req.body.inserir}`)
   }
   
   else {
    return res.send(`Valor de deposito invalido`)

   }
  
    
});

module.exports = router;
