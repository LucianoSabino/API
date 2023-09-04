const express = require("express");
const app = express();
const boyParser = require("body-parser");

const cors = require("cors") //Biblioteca para o consumo da api
app.use(cors());

// Inicianodo o boyParser 
app.use(boyParser.urlencoded({extended: false}));
// Convertendo para json
app.use(boyParser.json());


var DB = {
    games: [
        {
            id: 23,
            title: "Call of duty MW",
            year: 2019,
            price: 60
        },
        {
            id: 65,
            title: "GTA",
            year: 2000,
            price: 40
        },
        {
            id: 9,
            title: "Minecraft",
            year: 2012,
            price: 20
        },
    ]
}



// Criando as rotas

// Listagem de todos so gemes quee esta cadastrado
app.get("/games", (req, res) => {
    res.statusCode = 200;
    res.json(DB.games);
});

// Logica de pega pelo id intem no banco dedos
app.get("/game/:id", (req, res) => {
    // Validação de id
    // Venso se é um numero
    if(isNaN(req.params.id)){
        res.sendStatus(400);
    }else{
        // Pegando o id e transformando em um nuemro
        const id = parseInt(req.params.id);

        // Fazendo a busca do id passado
        const game = DB.games.find(g => g.id == id);

        // Verifica se existe no banco de dados o id, se sim retorna as informação, se não retorna 404
        if(game != undefined){
            res.statusCode = 200;
            res.json(game);
        }else{
            res.sendStatus(404);
        }
    }

});

// Cadrastrando dados
app.post("/game", (req, res) => {
    const validacao = {title, price, year} = req.body;
    // Validação
    if(isNaN(validacao.price) || isNaN(validacao.year)|| validacao.title == undefined){
        res.sendStatus(400);
        console.log("Foi");
    }else{
        DB.games.push({
            id: 55,
            title,
            price,
            year
        });
        res.sendStatus(200); 
    }

    
});

// Deletando dados
app.delete("/game/:id", (req, res) => {
    // Validação de id
    if(isNaN(req.params.id)){
        res.sendStatus(400);
    }else{
        // Pegando o id e transformando em um nuemro
        const id = parseInt(req.params.id);

        // buscando index
        const index = DB.games.findIndex(g => g.id == id);

        // Se o index não existir retorna 404, se existir apaga 
        if(index == -1){
            res.sendStatus(404);
        }else{
            DB.games.splice(index,1);
            res.sendStatus(200);
        }

    }

});

// Edição
app.put("/game/:id", (req, res) => {

    if(isNaN(req.params.id)){
        res.sendStatus(400);
    }else{
        const id = parseInt(req.params.id);
        const game = DB.games.find(g => g.id == id);
        if(game != undefined){
            const {title, price, year} = req.body;

            if(title != undefined){
                game.title = title;
            }
            if(price != undefined){
                game.price = price;
            }
            if(year != undefined){
                game.year = year
            }
            res.sendStatus(200);
        }else{
            res.sendStatus(404);
        }
    } 
});



// Iniciando o sevidor
app.listen(3030, () => {
    console.log("API RODANDO");
    console.log("http://localhost:3030/");
})