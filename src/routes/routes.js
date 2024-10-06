

const express =require('express')
const router = express.Router(); 
const mysql = require('mysql2')
const flash = require('connect-flash');



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

    let saldo_usuario = req.session.userId
    let nome_usuario = req.session.userName
    
    //CRIANDO QUERIE SQL PARA GERAR SALARIO TOTAL DO USUARIO
    let sql = `SELECT SUM(DEPOSITO) -  COALESCE(SUM(RETIRADA), 0) as saldo_total FROM CONTA WHERE ID = ${saldo_usuario}`
    
    conexao.query(sql, [saldo_usuario], (erro, retorno) => {
        if (erro) {
            console.error('Erro ao executar a query:', erro);
            return res.status(500).send('Erro no servidor');
        }

        // Verificar e acessar o saldo total do resultado da consulta
        const saldoTotal = retorno[0].saldo_total || 0;

        // Renderizar o template Handlebars e passar o saldo total
        res.render('area_inicial', { saldo_total: saldoTotal, nome_usuario });
        
    
    })
      
  
})


router.get('/teste', (req,res) =>{
    if (!req.session.userId) {
        return res.redirect('/');
      }
    res.render('depositar' , {nome: req.session.userName})
})

//RESPONSAVEL POR RECEBER O VALOR INSERIDO PELO MODO POST E VALIDAR
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
    
    // req.flash('success', 'Dinheiro depositado com sucesso!');
    res.redirect('/principal')
    //return res.send(`Deposito no valor de R$ ${req.body.inserir}`)
   }
   
   else {
    return res.send(`Valor de deposito invalido`)

   }
      }
   
  
   
);


//ROTA PARA IR PARA O TEMPLATE DERETIRADA DE DINHEIRO
router.get('/sacar', (req,res)=>{
    res.render('sacar_dinheiro')
})

// //ROTA PARA VALIDAR  RETIRADA DO DINHEIRO
// router.post('/sacar_dinheiro', (req,res)=>{
    

//     if (!req.session.userId) {
//         return res.status(401).send('Usuário não autenticado');
//     }


//     //CAPTURANDO ID DO USUARIO
//     let clienteID = req.session.userId;
//     console.log(`ID do cliente da sessão: ${clienteID}`);
//     //PEGA VARAIVEL DO BANCO E IMBUTE ELA NO REQ.BODY.RETIRAR DO FRONT
//     let retirada = req.body.retirar

//     let sql = `SELECT SUM(DEPOSITO) -  COALESCE(SUM(RETIRADA), 0) as saldo_total FROM CONTA WHERE ID = ${clienteID}`

//     conexao.query(sql, [clienteID], (erro, resultado) => {
//     if (erro) {
//         console.error('Erro ao executar a query:', erro);
//         return res.status(500).send('Erro no servidor');
//     }

//     // Verificar e acessar o saldo total do resultado da consulta
//     const saldoTotal = resultado[0].saldo_total ;
//     //const saldo_Total = resultado[clienteID].saldo_total
//     console.log(`sALDO TOTAL :${saldoTotal}`)
//     console.log(`Saque dinheiro :${retirada}` )
//     // Verificar se a retirada excede o saldo disponível
//     if (retirada > saldoTotal) {
//             return res.send('Valor excedido');
//         }

//     else{
//         let sql = `INSERT INTO CONTA (ID, RETIRADA)
//         VALUES ('${clienteID}', '${retirada}')
//         ON DUPLICATE KEY UPDATE SALDO_ATUAL = VALUES(SALDO_ATUAL)`

//     conexao.query(sql,function(erro, retorno){
//             if(erro) throw erro
//         })
//             res.redirect('/principal')
//         }
//         }
        
        
        
//     )}

// )
router.post('/sacar_dinheiro', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).send('Usuário não autenticado');
    } 

    // Captura o ID do usuário e o valor da retirada
    const clienteID = req.session.userId;
    const retirada = parseFloat(req.body.retirar);

    // Valida o valor da retirada
    if (isNaN(retirada) || retirada <= 0) {
        return res.send('Valor inválido para retirada.');
    }

    // Consulta para obter o saldo total
    const saldoQuery = `SELECT SUM(DEPOSITO) - COALESCE(SUM(RETIRADA), 0) as saldo_total FROM CONTA WHERE ID = ?`;

    conexao.query(saldoQuery, [clienteID], (erro, resultado) => {
        if (erro) {
            console.error('Erro ao executar a query:', erro);
            return res.status(500).send('Erro no servidor');
        }

        // Verifica e acessa o saldo total do resultado da consulta
        const saldoTotal = parseFloat(resultado[0].saldo_total) || 0;
        console.log(`Saldo Total: ${saldoTotal}`);
        console.log(`Retirada: ${retirada}`);

        // Verifica se a retirada excede o saldo disponível
        if (retirada > saldoTotal) {
            return res.send('Valor excedido');
        }

        // Atualiza o banco de dados com a retirada
        const updateQuery = `
            INSERT INTO CONTA (ID, RETIRADA)
            VALUES (?, ?)
            ON DUPLICATE KEY UPDATE RETIRADA = VALUES(RETIRADA), SALDO_ATUAL = SALDO_ATUAL - VALUES(RETIRADA)
        `;

        conexao.query(updateQuery, [clienteID, retirada], (erro, resultado) => {
            if (erro) {
                console.error('Erro ao executar a query de atualização:', erro);
                return res.status(500).send('Erro no servidor');
            }

            res.redirect('/principal');
        });
    });
});



//EXIBIR TODOS USUARIOS
router.get('/listagem', (req,res) => {
  let sql = 'SELECT NOME, SENHA FROM CLIENTE'

  //total é um parametro qualquer que se passa para exibir o resultaod da uery 
  conexao.query(sql,function(erro,retorno){
    res.render('verifica_usuarios',{total:retorno})
  })
})

module.exports = router;
