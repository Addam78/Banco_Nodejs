const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
     res.render('depositar');
    //res.send('Ola')
    
});
router.get('/teste', (req,res) =>{
    res.render('receber')
})

router.post('/inserir_nota', (req, res) => {
   if (req.body.inserir >= 0){
    return res.send(`Deposito no valor de R$ ${req.body.inserir}`)
   }
   else {
    return res.send(`Valor de deposito invalido`)

   }
    
});

module.exports = router;
