const express = require("express");
const app = express();
const boyParser = require("body-parser"); //TODO saber oq faz
const jwt = require("jsonwebtoken");

const JWTSecret = "ljgjdjgjdjgldjlgjnnnvisfhif"; //Chave para o token

const cors = require("cors") //Biblioteca para o consumo da api
app.use(cors());


// Inicianodo o boyParser 
app.use(boyParser.urlencoded({extended: false}));
// Convertendo para json
app.use(boyParser.json());

// Uma fução que executada antes de qualquer rota
// sempre que tiver o nome auth, que dizer que essa rota é protegida por altenticação
function auth(req, res, next){
    const authToken = req.headers['authorization'];

    // Verificação
    if(authToken != undefined){
        // Validação do token
        const bearer = authToken.split(' '); //dividindo o token em um arry de string,que fica a primeira parte é tipo do token e a segunda é o tokrn
        const token = bearer[1];

        // Verificando se o token é valido e descritografa
        jwt.verify(token, JWTSecret, (err, data) => {
            if(err){
                res.status(401);
                res.json({err: "Token invalido!"})
            }else{
                // Essas variaveis posso assersar em qualquer lugar que eu chamo a função auth
                req.token = token;
                req.loggedUser = {id: data.id, email: data.email}
                next();
            }
        });
    }else{
        res.status(401);
        res.json({err: "Token invalido"})
    }
}

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
    ],
    users: [
        {
            id: 2,
            name: "Luciano",
            email: "Luciano@gmail.com",
            password: "123"
        },
        {
            id: 30,
            name: "Lucas",
            email: "lucas@gmail.com",
            password: "456"
        }
    ]
}



// Criando as rotas

// Listagem de todos so gemes quee esta cadastrado
app.get("/games",auth, (req, res) => {
    res.statusCode = 200;
    res.json(DB.games);
});

// Logica de pega pelo id intem no banco dedos
app.get("/game/:id",auth, (req, res) => {
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
app.post("/game",auth, (req, res) => {
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
app.delete("/game/:id",auth, (req, res) => {
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
app.put("/game/:id",auth, (req, res) => {

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

// Login
app.post("/auth", (req, res) => {
    const {email, password} = req.body;

    // VAlidações
    if(email != undefined){
        const user = DB.users.find(u => u.email == email); //Fitrando o  email
        console.log("Entrei")
        if(user != undefined){
            // Verificando a senha
            if(user.password == password){
                console.log("Entrei senha")
                // Chamando o token
                //Informações que vai dentro do token, passando a chave, e o tempo de expiração 
                jwt.sign({id: user.id, email: user.email},JWTSecret,{expiresIn: "48h"}, (err, token) => {
                    if(err){
                        res.status(400);
                        res.json({err: "Falha interna!"});
                    }else{
                        console.log("Entrei foi")
                        res.status(200);
                        res.json({token: token});
                    }
                });
            }else{
                res.status(401);
                res.json({err: "Credenciais invalida"});
            }

        }else {
            res.status(404);
            res.json({err: "E-mail não encontraddo"})
        }

    }else {
        res.status(400);
        res.json({err: "E-mail envalido"})
    }
});



// Iniciando o sevidor
app.listen(3030, () => {
    console.log("API RODANDO");
    console.log("http://localhost:3030/");
});