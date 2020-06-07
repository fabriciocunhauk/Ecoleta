const express = require("express");

const server = express();

const nunjucks = require("nunjucks")

server.use(express.static('public'))
nunjucks.configure("src/views", {
    express: server,
    noCache: true
})

server.get('/', (req, res) => {
    return res.render("index.html", { title: "Ecoleta" })
})

server.get('/create-point', (req, res) => {
    return res.render("create-point.html")
})

server.get('/search', (req, res) => {
    return res.render("search-results.html")
})

server.listen(3000, () => console.log("Server started on port 3000"))