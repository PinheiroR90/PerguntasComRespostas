const express = require("express");
const app = express();
var bodyParser = require('body-parser');
const connection = require("./database/database");
const Pergunta = require('./database/Pergunta');
const Respostas = require("./database/Respostas");
    

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.set("view engine","ejs");
app.use(express.static("public"));

// conexão ao database
connection
.authenticate()
.then(() => {
    console.log("conexão ao banco");
}).catch((msgError)=>{
    console.log(msgError);
});

app.get("/",(req,res)=>{
    Pergunta.findAll({row:true, order:[[
        'id','DESC'
    ]]}).then(perguntasnew =>{
        res.render("index",{
            perguntasnew:perguntasnew
        })
    })
    
});


app.get("/perguntar",(req,res)=>{
    res.render("perguntar")
}); 

app.post("/salvarperguntas",(req,res)=>{
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;
    
    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(()=>{
        res.redirect("/")
    })
});

app.get("/duvida/:id",(req,res)=>{
    var id = req.params.id;
    Pergunta.findOne({
        where: {id:id}
    }).then(duvidas =>{
       if(duvidas!= undefined){
          Respostas.findAll({
              where:{duvidaId:duvidas.id}
          }).then(respostas =>{
              res.render("duvida",{
                duvidas: duvidas,
                respostas:respostas
            });
             
        });
          
       }else{
        res.redirect("/")
       }
    })/*.catch(error=>{
        console.log(msgError)
    })*/
});

app.post("/responder",(req,res)=>{
    var corpo = req.body.corpo;
    var duvidaId = req.body.duvidas;
    Respostas.create({
        corpo:corpo,
        duvidaId:duvidaId 

    }).then(()=>{
        res.redirect("/duvida/"+ duvidaId);
    })/*.catch(()=>{
        res.redirect("/")
    })*/
});
/*  //em andamento
app.delete("/duvida/delete", (req, res) => {
     var id = req.body.id;
     if(id!=undefined){
        if(id!=isNaN){
           duvidas.destroy({
               where:{
                   id : id
                    }           
        }).then(()=>{
            res.redirect("/");
        })
        }else{
            res.redirect('/');
        }
     }
});*/
app.listen(2000,()=>{
    console.log("APP Rum")
});
   