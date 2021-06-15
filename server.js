
// iniciando a importação das const dos models
const usuario = require("./models/usuario");
const pessoa  = require("./models/pessoa")
usuario.belongsTo(pessoa,{foreingkey: 'Pessoaid',allowNull:true})
const ongCadastro = require("./models/ongs");
const doadorCadastro = require("./models/doador");
const doacaoCadastro = require("./models/doacao");
const fale_conosco = require("./models/fale_conosco");
//terminando a importação das const dos models
 

//configurando envio de email
const notificar = require("./controler/notificar")


//terminando configuração de envio de email


//configurações de dependencias
const express = require("express")
const app = express()
const handlebars = require("express-handlebars")
const bodyParser = require("body-parser")
var session = require('express-session');
 app.use(session({
     secret: 'secret',
     resave: true,
     saveUninitialized: true
 }));

const crypto = require("crypto-md5");
const multer = require("multer")
const storage = multer.diskStorage({
       destination:(req,file,cb) =>{cb(null,'public/imagens')},
       filename:(req,file,cb) => {cb(null,file.originalname)}
 })
 
const upload = multer({storage})

app.engine('handlebars',handlebars({defaultLayout:'main'}))
 app.set('view engine','handlebars')
//configurar o  motor de tamplate handlebar
app.use(bodyParser.urlencoded({extended:false}))
 app.use(bodyParser.json())
app.use('/static',express.static(__dirname + '/public'))
//terminando as configurações das dependencias




//COMEÇANDOANDO CONFIGURAÇÕES DO DOADOR
//criando usuarios das doador
  app.post('/cadDoador',function(req,res){
    doadorCadastro.create({
        nome:req.body.nome,
        cpfcnpj:req.body.cpfcnpj,
        endereco:req.body.endereco,
        numero:req.body.numero,
        bairro:req.body.bairro,
        cidade:req.body.cidade,
        estado:req.body.estado,
        email:req.body.email,
        whatsapp:req.body.whatsapp,
        notificacao:req.body.notificacao
    }).then(function(){
        doadorCadastro.findAll().then(function(doadores){
            res.render('cadastroDoador',{doador: doadores.map(cadastrar => cadastrar.toJSON())})
    })
    }).catch(function(erro){
        res.send("Erro"+erro)
    })
})
//este bloco e disparado pela url do navegador e buscar o cadastroDoador
app.get('/cadastroDoador',function(req,res){
    doadorCadastro.findAll().then(function(doadores){
        res.render('cadastroDoador',{doador: doadores.map(cadastrar => cadastrar.toJSON())})
    })
})

//criando nova rota para formulario de updateDoador
app.get('/updateDoador/:id',function(req,res){
    doadorCadastro.findAll({ where:{'id':req.params.id}}).then(function(doadores){
            res.render('updateDoador',{doador: doadores.map(cadastrar => cadastrar.toJSON())})
    })

})

//depois vamos criar essa rota que envia para o banco de dados e chama o  formulario de edição
app.post('/updateDoador',function(req,res){
    doadorCadastro.update({
        
        
        nome:req.body.nome,
        cpfcnpj:req.body.cpfcnpj,
        endereco:req.body.endereco,
        numero:req.body.numero,
        bairro:req.body.bairro,
        cidade:req.body.cidade,
        estado:req.body.estado,
        email:req.body.email,
        whatsapp:req.body.whatsapp,
        notificacao:req.body.notificacao},{
            where:{id:req.body.id}}
    ).then(function(){
        doadorCadastro.findAll().then(function(doadores){
            res.render('cadastroDoador',{doador: doadores.map(cadastrar => cadastrar.toJSON())})
    })
    }).catch(function(erro){
        res.send("Erro"+erro)
    })
})
//criando o delete doador
    app.post('/deleteDoador',function(req,res){
        doadorCadastro.destroy({
            where:{'id': req.body.id}
        }).then(function(){
            doadorCadastro.findAll().then(function(doadores){
                res.render('cadastroDoador',{doador: doadores.map(
                    cadastrar => cadastrar.toJSON())})
            })
    
          .catch(function(){res.send("Não deu certo")
            })
        })
    })
//TERMINANDO TODAS CONFIGURAÇÕES DO DOADOR





//COMEÇANDO TODAS CONFIGURAÇÕES  DE DOAÇÃO
//criando tabela doacao
app.post('/cadDoacao',function(req,res){
   
    doacaoCadastro.create({
        categoria:req.body.categoria,
        descricao:req.body.descricao,
        nivel:req.body.nivel,
        idOng:req.body.idOng,

    }).then(function(){
        ongCadastro.findAll({where:{'id': req.body.idOng}}).then(function(doacoes){
            res.render('cadastroDoacao',{doacao: doacoes.map(cadastradoacao => cadastradoacao.toJSON())})
        }).catch(function(erro){
        res.send("Erro"+erro)
    })
})
})
//este bloco e disparado pela url do navegador e buscar o cadastroDoacao
app.get('/cadastroDoacao',function(req,res){
    doacaoCadastro.findAll().then(function(doacoes){
        res.render('cadastroDoacao',{doacao: doacoes.map(cadastradoacao => cadastradoacao.toJSON())})
    })
})
//criando nova rota get para chamar somente as doações do id logado
app.get('/listaDoacao/:idOng',function(req,res){
    doacaoCadastro.findAll({where:{'id':req.params.idOng}}).then(function(doacoes){
            res.render('cadastroDoacao',{doacao: doacoes.map(cadastrodoacao => cadastrodoacao.toJSON())})
    })
})

//criando nova rota para formulario de updateDoacao
app.get('/updateDoacao/:id',function(req,res){
    doacaoCadastro.findAll({ where:{'id':req.params.id}}).then(function(doacoes){
            res.render('updateDoacao',{doacao: doacoes.map(cadastradoacao => cadastradoacao.toJSON())})
    })
})
//depois vamos criar essa rota que envia para o banco de dados e chama o  formulario de edição de doacao

app.post('/updateDoacao',function(req,res){
    doacaoCadastro.update({
        
        
        categoria:req.body.categoria,
        descricao:req.body.descricao,
        nivel:req.body.nivel},{
            where:{id:req.body.id}}
    ).then(function(){
  
        doacaoCadastro.findAll().then(function(doacoes){
            res.render('cadastroDoacao',{doacao: doacoes.map(cadastradoacao => cadastradoacao.toJSON())})
    })
    }).catch(function(erro){
        res.send("Erro"+erro)
    })
})

//criando o delete doacao
    app.post('/deleteDoacao',function(req,res){
        doacaoCadastro.destroy({
            where:{'id': req.body.id}
        }).then(function(){
            doacaoCadastro.findAll().then(function(doacoes){
                res.render('cadastroDoacao',{doacao: doacoes.map(
                    cadastradoacao => cadastradoacao.toJSON())})
            })
    
          .catch(function(){res.send("Não deu certo")
            })
        })
    })

//TERMINANDO TODAS CONFIGURAÇÕES DE DOAÇÃO






// COMEÇANDO TODAS CONFIGURAÇÕES  DE ONG
//criando a tabela  ongs
app.post('/cadOng', upload.single('imagem_prod'),function(req,res){
    if(req.file){
        var imagem = req.file.originalname
    }else{
        var imagem = 'semfoto.jpg'
    }
    ongCadastro.create({
        razaoSocial:req.body.razaoSocial,
        cnpj:req.body.cnpj,
        endereco:req.body.endereco,
        numero:req.body.numero,
        bairro:req.body.bairro,
        cidade:req.body.cidade,
        estado:req.body.estado,
        email:req.body.email,
        senha: crypto(req.body.senha),
        whatsapp:req.body.whatsapp,
        telefoneFixo:req.body.telefoneFixo,
        foto:imagem
    }).then(function(){
        ongCadastro.findAll().then(function(ongs){
            res.render('cadastroOng',{ong: ongs.map(cadastramento => cadastramento.toJSON())})
    })
    }).catch(function(erro){
        res.send("Erro"+erro)
    })
})
//este bloco e disparado pela url do navegador e buscar o cadastroOng
app.get('/cadastroOng',function(req,res){
    if(req.session.email){

    ongCadastro.findAll().then(function(ongs){
        res.render('cadastroOng',{ong: ongs.map(cadastramento => cadastramento.toJSON())})
    })
}else{
    res.render('cadastroOng')
}
})
//criando nova rota para formulario de updateOng
app.get('/updateOng/:id',function(req,res){
    ongCadastro.findAll({ where:{'id':req.params.id}}).then(function(ongs){
            res.render('updateOng',{ong: ongs.map(cadastramento => cadastramento.toJSON())})
    })
})
//depois vamos criar essa rota que envia para o banco de dados e chamar o  formulario de edição da ong
app.post('/updateOng',function(req,res){
    ongCadastro.update({
        razaoSocial:req.body.razaoSocial,
        cnpj:req.body.cnpj,
        endereco:req.body.endereco,
        numero:req.body.numero,
        bairro:req.body.bairro,
        cidade:req.body.cidade,
        estado:req.body.estado,
        email:req.body.email,
        senha: crypto(req.body.senha),
        whatsapp:req.body.whatsapp,
        telefoneFixo:req.body.telefoneFixo,
},{
            where:{id:req.body.id}}
    ).then(function(){
        ongCadastro.findAll().then(function(ongs){
            res.render('cadastroOng',{ong: ongs.map(cadastramento => cadastramento.toJSON())})
    })
    }).catch(function(erro){
        res.send("Erro"+erro)
    })
})
//criando o delete ong
    app.post('/deleteOng',function(req,res){
        ongCadastro.destroy({
            where:{'id': req.body.id}
        }).then(function(){
            ongCadastro.findAll().then(function(ongs){
                res.render('cadastroOng',{ong: ongs.map(
                    cadastramento => cadastramento.toJSON())})
            })
    
          .catch(function(){res.send("não deu certo")
            })
        })
    })

//Rota de login ong
app.get('/verificaLogin',function(req,res){
    res.render('verificaLogin')
    req.session.usuarioteste = 1
})

//criando a rota da session para verificar  se email e senha conferem no banco de dados
app.post('/verificaLogin',function (req,res){
    
    req.session.email = req.body.email;
    req.session.senha = crypto(req.body.senha);
   
    ongCadastro.count({where:[{ email: req.session.email },{senha: req.session.senha }]}).then(function(dados){
        if(dados >=1){
            ongCadastro.findAll({where:{email:req.session.email}}).then(function(ongs){
                 idUsuario = ongs.map(u => u.toJSON().id)
                 req.session.idUsuario = idUsuario.toString()
                doacaoCadastro.findAll({where:{ idOng:req.session.idUsuario}}).then(function(doacoes){
                     res.render('cadastroDoacao',{doacao: doacoes.map(cadastramento => cadastramento.toJSON())})
                })
                })
        }else if(req.session.usuarioteste == 1){
            res.render("verificaLogin",{mensagem:"Usuário Inválido"})
            req.session.usuarioteste++
        }else{
            res.redirect("verificaLogin")
            
        }
    })
})

//criando nova rota get para chamar as informações com tal id
app.get('/perfilOng/:idOng',function(req,res){
    ongCadastro.findAll({where:{'id':req.params.idOng}}).then(function(ongs){
            res.render('perfilOng',{ong: ongs.map(cadastramento => cadastramento.toJSON())})
    })
})

//criando nova rotas para listagem
app.get('/listaOng',function(req,res){
    ongCadastro.findAll().then(function(ongs){
            res.render('cadastroOng',{ong: ongs.map(cadastramento => cadastramento.toJSON())})
    })
})
/*
//criando nova rota get para listar opção de editar apenas a ong logada
app.get('/listaEditarOng/:idOng',function(req,res){
    ongCadastro.findAll({where:{'id':req.params.id}}).then(function(ongs){
            res.render('perfilOng',{ong: ongs.map(cadastramento => cadastramento.toJSON())})
    })
})
*/
//TERMINANDO CONFIGURACÕES DA ONG
   







//criando rota para sair do login
app.get('/logoff',function(req,res){
    req.session.destroy(function(){
        res.redirect('verificaLogin')        
    })
})






//criando rota principal
app.get('/',function(req,res){
    doacaoCadastro.findAll().then(function(doacoes){
        res.render('index',{doacao: doacoes.map(cadastradoacao => cadastradoacao.toJSON())})

})
})




app.listen(3000);





