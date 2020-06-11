const express = require("express");
const server = express();

// Pegar o banco de dados o db.js
const db = require("./database/db.js")

// habilitar o uso do req.body
server.use(express.urlencoded({ extender: true }))

const nunjucks = require("nunjucks")

// Configurar pasta publica
server.use(express.static('public'))

// Utilizando template engine
nunjucks.configure("src/views", {
    express: server,
    noCache: true
})

// Configurar caminhos da minha aplicacao
// Pagina inicial
// req: Requisicao
// res: Resposta
server.get('/', (req, res) => {
    return res.render("index.html", { title: "Ecoleta" })
})

server.get('/create-point', (req, res) => {
    //req.query: query strings da nossa url
    // console.log(req.query)

    return res.render("create-point.html")
})

server.post("/savepoint", (req, res) => {

    // req.body: o corpo do nosso formulario
    // console.log(req.body)

    //inserir dados no banco de dados
    const query = `
        INSERT INTO places (
            image,
            name,
            address,
            address2,
            state,
            city,
            items
    ) VALUES (?,?,?,?,?,?,?);
    `
    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items,
    ]

    function afterInsertData(err) {
        if (err) {
            return console.log(err);
        }
        console.log("Cadastrado com sucesso");
        console.log(this);

        return res.render("create-point.html", { saved: true })
    }

    db.run(query, values, afterInsertData)
})

server.get('/search', (req, res) => {

    const search = req.query.search

    if (search == "") {
        return res.render("search-results.html", { total: 0 })
    }

    //Pegar dados da tabela/ 3 consultar os dados na tabela
    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function (err, rows) {
        if (err) {
            return console.log(err);
        }

        const total = rows.length

        console.log("Aqui estao seus registros");
        console.log(rows);

        // Mostrar a pagina HTML com os dados do banco de dados
        return res.render("search-results.html", { places: rows, total: total })
    })
})

server.listen(3000, () => console.log("Server started on port 3000"))
