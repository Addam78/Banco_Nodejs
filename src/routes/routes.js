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
     res.render('login');
    //res.send('Ola')
    
});

router.get('/cadastrar', (req,res) =>{
    res.render('registrar')
})

//VALIDAR CADASTRO
router.post('/validar_cadastro', (req,res) => {

    //DECLARAR VARIAVAEL
    const nome = req.body.nome;
    const senha = req.body.senha;
    const cpf = req.body.cpf; // Corrigido para 'cpf'

    // Verificar se já existe um usuário com o mesmo nome, CPF ou senha
    let sql = `
        SELECT COUNT(*) AS count 
        FROM CLIENTE 
        WHERE NOME = ? OR CPF = ? OR SENHA = ?
    `;

    conexao.query(sql, [nome, cpf, senha], (erro, resultado) => {
        if (erro) {
            console.error(erro);
            return res.status(500).send('Erro no servidor');
        }

        if (resultado[0].count > 0) {
            return res.send('Usuário já existente com o mesmo nome, CPF ou senha');
        } else {
            // Inserir novo usuário
            const insertSql = `
                INSERT INTO CLIENTE (NOME, SENHA, CPF) 
                VALUES (?, ?, ?)
            `;
            conexao.query(insertSql, [nome, senha, cpf], (erro, retorno) => {
                if (erro) {
                    console.error(erro);
                    return res.status(500).send('Erro ao cadastrar usuário');
                }
                res.redirect('/');
            });
        }
    });
});
  
        
        
         
        
   


    // else{
    //     let sql = `INSERT INTO CLIENTE (NOME,SENHA,CPF) VALUES ('${nome}', '${senha}',' ${cpf}')`
    //     conexao.query(sql,function(erro, retorno){
    //         if(erro) throw erro
    //        })
    //     res.redirect('/')
    // }
  


//VERIFICAR LOGIN
router.post('/verifica', (req,res) => {
    let nome = req.body.nome
    let senha = req.body.senha



    // Query SQL com placeholders para evitar SQL Injection
    let sql = 'SELECT ID, NOME, SENHA FROM CLIENTE WHERE NOME = ? AND SENHA = ?';

    // Executa a consulta ao banco de dados
    conexao.query(sql, [nome, senha], (erro, resultados) => {
    if (erro) {
      console.error('Erro ao consultar o banco de dados:', erro);
      res.status(500).send('Erro interno do servidor');
      return;
    }

    // Verifica se há algum resultado
    if (resultados.length > 0) {
        req.session.userId = resultados[0].ID;
        req.session.userName = resultados[0].NOME;
      // Usuário encontrado, redireciona para a página principal
      res.redirect('/principal');
    } else {
      // Usuário não encontrado, retorna mensagem de erro
      res.send('Usuário e senha inválidos');
    }
 
    
  });
});



//ROTA PARA IR PARA PAGINA INICIAL
router.get('/principal', (req,res) => {
    if (!req.session.userId) {
        return res.redirect('/');
      }
    
      res.render('area_inicial', { nome: req.session.userName })
      
  
})

router.get('/teste', (req,res) =>{
    if (!req.session.userId) {
        return res.redirect('/');
      }
    res.render('depositar' , {nome: req.session.userName})
})

router.post('/inserir_nota', (req, res) => {
  
     // Verificar se o ID do usuário está na sessão
     if (!req.session.userId) {
        return res.status(401).send('Usuário não autenticado');
    }

    // Obter o ID e nome do usuário da sessão
    let clienteID = req.session.userId;
    let deposito = req.body.inserir;

    console.log(`ID do cliente da sessão: ${clienteID}`);
    console.log(`Valor do depósito: ${deposito}`);

   
   if (req.body.inserir >= 10){

    //QUERIE MYSQL
   //let sql = `INSERT INTO CONTA (DEPOSITO) VALUES (${deposito})`
   //inserir o id de quem esta depositando
   let sql = `INSERT INTO CONTA (ID, DEPOSITO)
    VALUES ('${clienteID}', '${deposito}')
    ON DUPLICATE KEY UPDATE SALDO_ATUAL = VALUES(SALDO_ATUAL)`
   
   
    
    //EXECUTAR COMANDO
    conexao.query(sql,function(erro, retorno){
        if(erro) throw erro
       })


    return res.send(`Deposito no valor de R$ ${req.body.inserir}`)
   }
   
   else {
    return res.send(`Valor de deposito invalido`)

   }
      }
   
  
   
);

router.get('/listagem', (req,res) => {
  let sql = 'SELECT NOME FROM CLIENTE'

  conexao.query(sql,function(erro,retorno){
    res.render('verifica_usuarios',{total:retorno})
  })
})

module.exports = router;
