const express = require("express")
const app = express();
const bodyParser = require("body-parser")
const connection = require("./database/database")
const Pergunta = require("./database/Pergunta")
const Resposta = require("./database/Resposta")

// Database
connection
    .authenticate()
    .then( () => {
        console.log("conexão ok")
    }).catch((err) => {
        console.log(err)
    })

app.set("view engine", 'ejs')

app.use(express.static('public'));

// PAcote para trabalhar com parametros enviados via form
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// Rotas
app.get("/", (req, res) => {

    // Raw evita de serem retornados dados desnecessários do banco, retornará apenas o que vier das tuplas
    Pergunta.findAll({raw: true, order: [
        ['id', 'desc']
    ]}).then(perguntas => {
        res.render("index", {
            perguntas: perguntas
        })
    })
 
    

})

app.get("/perguntar", (req, res) => {
 
    res.render("perguntas/criar", {
    })

})

app.get("/pergunta/:id", (req, res) => {
    var id = req.params.id

    Pergunta.findOne({
        where: {id: id}
    }).then(pergunta => {
        if (pergunta != undefined) {

            Resposta.findAll({
                where: {pergunta_id: id},
                order: [
                    ['id', 'desc']
                ]
            }).then( respostas => {

                res.render('perguntas/pergunta', {
                    pergunta: pergunta,
                    respostas: respostas
                })

            })
        } else { // não encontrada
            res.redirect("/")
        }
    })


})

app.post("/pergunta/salvar", (req, res) => {
    
    var title = req.body.title
    var desc = req.body.description

    Pergunta.create({
        title: title,
        description: desc
    }).then(() => {
        res.redirect("/")
    })

    // res.send("Formulário recebido! título:" + title + ", desc: " + desc )

})

app.post("/responder", (req, res) => {
    var answer = req.body.answer
    var pergunta_id = req.body.pergunta_id

    Resposta.create({
        answer: answer,
        pergunta_id: pergunta_id
    }).then(() => {
        console.log('sucesso')

        res.redirect("/pergunta/" + pergunta_id)
    }).catch((err) => {
        console.log(err)
    })


})

app.listen(8080, () => {
    console.log('app rodando')
})